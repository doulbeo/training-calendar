import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../src/data/trainingData.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { defaultTrainingData } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);
const historySource = await readFile(new URL('../src/lib/training-history.ts', import.meta.url), 'utf8');
const { outputText: historyOutput } = ts.transpileModule(historySource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { getHistoricalPlans } = await import(
  `data:text/javascript;base64,${Buffer.from(historyOutput).toString('base64')}`
);
const currentWeek = defaultTrainingData.find(week => week.dateRange === '0907-0913');

test('September 7–13 dates, weekdays, session numbers and all 26 exercises match the plan', () => {
  assert.equal(currentWeek.weekNumber, 7);
  assert.deepEqual(currentWeek.days.map(day => day.date),
    ['9月7日', '9月8日', '9月9日', '9月10日', '9月11日', '9月12日', '9月13日']);
  currentWeek.days.forEach((day, index) => {
    assert.equal(day.dayOfWeek, new Date(2026, 8, 7 + index).getDay() || 7);
    assert.equal(day.week, 7);
    assert.equal(day.completed, false);
  });
  const trainingDays = currentWeek.days.filter(day => day.type !== 'rest');
  assert.deepEqual(trainingDays.map(day => day.label), [
    '蹲推训练', '硬拉后侧链训练',
    '蹲推训练', '硬拉后侧链训练',
  ]);
  assert.deepEqual(trainingDays.map(day => day.exercises.map(exercise => [
    exercise.name,
    ...exercise.lines.map(line => [line.sets, line.reps, line.weight, line.notes ?? ''].join('|')),
  ])), [
    [
      ['杠铃深蹲', '1|2|125kg|', '3|5|105kg|'],
      ['杠铃暂停卧推', '1|1|70kg|', '2|5|55kg|'],
      ['杠铃窄距卧推', '2|8|45kg|'],
      ['保加利亚单腿蹲', '3|10|10kg|'],
      ['单腿倒蹬', '3|10|RPE7|'],
      ['三头过头伸展', '3|10|10kg|'],
    ],
    [
      ['杠铃传统硬拉', '1|2|130kg|', '2|4|110kg|'],
      ['杠铃直腿硬拉', '3|8|75kg|带助力带'],
      ['杠铃臀桥 / 器械臀桥', '3|10|115kg|注意离心顶端收缩'],
      ['宽距高位下拉', '3|10|40kg|'],
      ['坐姿宽距划船', '3|10|40kg|'],
      ['哥本哈根支撑', '3|20-30秒|自重|'],
    ],
    [
      ['杠铃低杠暂停深蹲', '1|3|120kg|底端暂停1秒'],
      ['杠铃高杠暂停深蹲', '3|6|95kg|'],
      ['杠铃无腿暂停卧推', '1|3|60kg|暂停一秒', '3|8|45kg|暂停一秒'],
      ['杠铃实力推', '3|6|35kg|'],
      ['坐姿腿屈伸', '3|10|50kg|'],
      ['单手三头下压', '3|10|10kg|'],
    ],
    [
      ['杠铃传统硬拉', '4|4|125kg|'],
      ['罗马尼亚硬拉', '2|8|100kg|'],
      ['山羊挺身', '3|10|25kg|'],
      ['辅助引体', '3|8|49kg|'],
      ['哑铃垂式弯举', '3|10|5kg|'],
      ['坐姿宽距划船', '3|12|35kg|'],
      ['杠铃窄距卧推', '3|8|45kg|'],
      ['哥本哈根支撑', '3|30秒|自重|'],
    ],
  ]);
  assert.deepEqual(currentWeek.days.filter(day => day.type === 'rest').map(day => day.exercises), [[], [], []]);
});

test('published day IDs and dates remain unique', () => {
  const days = defaultTrainingData.flatMap(week => week.days);
  assert.equal(new Set(days.map(day => day.id)).size, days.length);
  assert.equal(new Set(days.map(day => day.date)).size, days.length);
  const exercises = currentWeek.days.flatMap(day => day.exercises);
  assert.equal(new Set(exercises.map(exercise => exercise.id)).size, 26);
});

test('action history contains only earlier plans for the same action, newest first', () => {
  const currentDay = currentWeek.days.find(day => day.id === 'w7d1');
  const history = getHistoricalPlans(defaultTrainingData, currentDay, '杠铃深蹲');

  assert.equal(history[0].date, '8月30日');
  assert.ok(history.every(plan => plan.date !== currentDay.date));
  assert.ok(history.every(plan => plan.lines.length > 0));
  assert.deepEqual(getHistoricalPlans(defaultTrainingData, defaultTrainingData[0].days[0], '杠铃深蹲'), []);
});

const completionSource = await readFile(new URL('../src/lib/training-completion.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(completionSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { loadCompletion, applyCompletion, COMPLETION_KEY, LEGACY_PLAN_KEY } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`
);
const storage = values => ({ getItem: key => values[key] ?? null });

test('legacy plans contribute completion only; new weeks and revised weights follow publication', () => {
  const old = structuredClone(defaultTrainingData.slice(0, 6));
  old[0].days[0].completed = true;
  old[0].days[0].exercises[0].lines[0].weight = '过期重量';
  const raw = JSON.stringify(old);
  const records = loadCompletion(storage({ [LEGACY_PLAN_KEY]: raw }));
  const current = applyCompletion(defaultTrainingData, records);
  assert.equal(current[0].days[0].completed, true);
  assert.deepEqual(current[0].days[0].exercises, defaultTrainingData[0].days[0].exercises);
  assert.deepEqual(current[6], currentWeek);
  assert.ok(Object.values(records).every(value => typeof value === 'boolean'));
  const revised = structuredClone(defaultTrainingData);
  revised[0].days[0].exercises[0].lines[0].weight = '新版重量';
  assert.equal(applyCompletion(revised, records)[0].days[0].exercises[0].lines[0].weight, '新版重量');
  assert.equal(defaultTrainingData[0].days[0].completed, false);
  assert.equal(JSON.stringify(old), raw);
});

test('separate records take precedence on subsequent loads, including an empty record', () => {
  const legacy = JSON.stringify([{ days: [{ id: 'w1d1', completed: true }] }]);
  assert.deepEqual(loadCompletion(storage({ [COMPLETION_KEY]: '{}', [LEGACY_PLAN_KEY]: legacy })), {});
  assert.deepEqual(loadCompletion(storage({
    [COMPLETION_KEY]: JSON.stringify({ w1d1: false, w7d1: true, invalid: 'true' }),
    [LEGACY_PLAN_KEY]: legacy,
  })), { w1d1: false, w7d1: true });
});

test('missing, corrupt or inaccessible storage does not block published plans', () => {
  for (const fake of [storage({}), storage({ [LEGACY_PLAN_KEY]: '{' }),
    storage({ [LEGACY_PLAN_KEY]: '[null, {"days":[null]}]' }),
    { getItem() { throw new Error('storage blocked'); } }]) {
    assert.deepEqual(applyCompletion(defaultTrainingData, loadCompletion(fake)), defaultTrainingData);
  }
  assert.deepEqual(loadCompletion(storage({
    [COMPLETION_KEY]: 'broken',
    [LEGACY_PLAN_KEY]: '[{"days":[{"id":"w1d1","completed":true}]}]',
  })), { w1d1: true });
});
