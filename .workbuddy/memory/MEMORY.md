# 训练日历项目记忆

## 项目结构
- 前端：React + TypeScript + Vite + Framer Motion，位于 frontend/
- 数据：frontend/src/data/trainingData.ts（训练计划主数据）
- 热身数据：frontend/src/data/warmupData.ts（固定，无需随计划更新）
- 类型定义：frontend/src/types/training.ts
- 构建：cd frontend && npm run build，预览：node_modules/.bin/vite preview --port <N>

## 数据格式
- TrainingWeek[] 数组，每周含 weekNumber / dateRange / days[]
- 每天含 id / date（"8月12日"格式）/ week / dayOfWeek（1-7，周一开始）/ type（squat|deadlift|rest）/ label / completed / exercises
- ex(name, [sets, reps, weight, notes?], ...) 辅助函数生成练习数据
- setId(前缀, exercises) 给练习分配唯一 id

## 训练计划历史
- 第1周（0722-0728）：第1-4练
- 第2周（0729-0804）：第5-8练（但 label 标为第5-8练，实际第7-8练重复了）
- 第3周（0805-0811）：第9-12练
- 第4周（0812-0818）：第7-10练
- 第5周（0821-0828）：第11-14练（原8.27→8.28后移，补8.27休息日，8天）
- 第6周（0830-0905）：第15-18练

## 更新流程
1. 会话开始或更新数据前，先 `git pull --ff-only` 同步远端（手机小程序端可能已通过云端改过仓库）
2. 远子发新计划 → 解析日期和动作 → 按格式追加到 trainingData.ts
3. cd frontend && npm run build 验证编译
4. node_modules/.bin/vite preview --port <N> 启动预览
5. present_files 展示结果

## 调整日期注意事项（重要）
- 调整某训练日日期时，必须同步：①把原训练日改成休息日或挪走 ②在新日期补训练日 ③days 数组按 date 升序重排，不能只改 date 字段否则数组顺序乱
- id 不能随便改：useTraining.ts 用 day.id 在 localStorage 匹配 completed 状态，改 id 会丢已标记记录

## localStorage 缓存陷阱（重要）
- useTraining.ts 的 loadData() 优先读 localStorage 快照，会完全覆盖 defaultTrainingData
- 后果：更新 trainingData.ts 后，浏览器若有旧缓存则看不到新数据（新周/修复全被挡住）
- 当前方案：每次更新数据后升级 STORAGE_KEY（现为 'training-calendar-data-v2'）强制刷新
- TODO：重构为按 id merge（localStorage 仅存 completed 状态，结构用最新 defaultTrainingData）一劳永逸

## 部署与云端协作
- 仓库：https://github.com/doulbeo/training-calendar（main 分支）
- 线上地址：https://training-calendar-beta.vercel.app，push 后 Vercel 自动部署（1-2 分钟）
- git push 需 dangerouslyDisableSandbox 绕过沙箱网络限制
- 云端协作流程（小程序端）：WorkBuddy 小程序 → 云端工作模式 → 从 GitHub 拉取仓库 → 改 trainingData.ts → push 回 GitHub → Vercel 自动部署
- 云端沙箱无本地记忆，靠仓库内本文件（MEMORY.md）提供格式约定；每次云端任务须重新拉取仓库
- 电脑端重新接手时先 git pull，避免两端同时修改冲突
