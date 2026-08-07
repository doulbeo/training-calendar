# 训练日历 — 产品需求文档 (PRD)

## 1. 产品概述

### 1.1 产品定位
一款移动端力量训练工具，以日历视图浏览每日训练安排，支持按月切换、点击查看动作详情；附带专业四阶段热身清单，覆盖筋膜松解到平衡整合的完整热身流程。

### 1.2 目标用户
- 力量训练爱好者，有固定的周期性训练计划
- 需要随时在手机上查看当天训练内容和热身流程

### 1.3 核心价值
- 训练计划一目了然，日历视图直观呈现
- 点击任意训练日即可查看完整动作列表
- 按月切换，支持长期训练计划扩展
- 自动识别当天日期，打开即定位到当日训练
- 热身清单独立页面，四阶段分步引导，训练前照做即可

---

## 2. 功能需求

### 2.1 月历视图
- **每页显示一个月**，周一至周日为标准日历网格
- **顶部左右箭头**切换月份，带滑动动画
- **底部圆点指示器**显示当前月份位置
- 自动定位到包含当天的月份

### 2.2 训练日标识
- **红色数字** = 蹲推训练日
- **蓝色数字** = 硬拉后侧链训练日
- **灰色数字** = 休息日
- **橙色圆环** = 当天日期

### 2.3 训练详情展开
- 点击训练日（非休息日）展开当日训练详情卡片
- 卡片显示：日期、训练类型标签、动作列表
- 每个动作包含：动作名称、组数×次数、重量
- 组合动作（如"1×3 115kg + 3×5 100kg"）分行显示
- 再次点击同一日期收起详情

### 2.4 默认当天选中
- 打开页面时自动选中当天的训练日
- 如果当天是休息日则不做默认选中

### 2.5 热身清单（v2.0 新增）
- 首页 Header 右上角「热身清单」按钮（橙色，🔥 图标）
- 点击跳转至独立 `/warmup` 页面
- 四阶段标签导航，点击快速切换阶段
- 每阶段展示标题、说明文字、动作列表
- 每个动作包含序号、名称、分步指导要点
- 底部「✅ 执行建议」卡片（时长、无痛原则、呼吸节奏）
- 左上角返回箭头回到训练日历首页

#### 热身四阶段内容

| 阶段 | 标题 | 动作数 | 重点 |
|------|------|--------|------|
| 第一阶段 🫧 | 筋膜松解 | 5 | 泡沫轴/筋膜球松解股四头肌、髂胫束、臀部、胸椎段、背阔肌 |
| 第二阶段 🧘 | 灵活性与静态拉伸 | 3 | 鸽式伸展、猫式伸展、90/90转髋 |
| 第三阶段 ⚡ | 核心与肩部激活 | 3 | 死虫式、弹力带绕肩、招财猫 |
| 第四阶段 🎯 | 单侧稳定与平衡整合 | 2 | 膝盖顶泡沫轴抵墙（臀部单腿支撑 + 髋部飞机） |

---

## 3. 技术架构

### 3.1 技术栈
| 层级 | 技术 |
|------|------|
| 框架 | React 19 + TypeScript |
| 构建 | Vite 7 |
| 样式 | Tailwind CSS 4 + CSS Variables |
| 动画 | Framer Motion |
| 图标 | Lucide React |
| 字体 | Barlow + Barlow Condensed |
| 路由 | react-router-dom v7 |
| 部署 | Vercel（GitHub 自动部署） |

### 3.2 项目结构
```
frontend/src/
├── components/
│   ├── training/
│   │   ├── CalendarView.tsx    # 月历主组件
│   │   ├── DayCard.tsx         # 训练日卡片
│   │   └── ProgressBar.tsx     # 进度条
│   ├── ui/                     # UI 基础组件 (Radix UI)
│   ├── MotionPrimitives.tsx    # 动画基础组件
│   ├── PageTransition.tsx      # 页面切换动画
│   └── AnimatedRoutes.tsx      # 路由动画
├── data/
│   ├── trainingData.ts         # 训练数据（所有训练计划）
│   └── warmupData.ts           # 热身清单数据（四阶段）
├── hooks/
│   └── useTraining.ts          # 训练数据状态管理
├── pages/
│   ├── Index.tsx               # 首页（训练日历）
│   ├── Warmup.tsx              # 热身清单页面
│   └── NotFound.tsx            # 404 页面
├── types/
│   └── training.ts             # 类型定义
├── index.css                   # 全局样式 + 设计系统
└── main.tsx                    # 入口文件
```

### 3.3 路由表
| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | Index | 训练日历首页 |
| `/warmup` | Warmup | 热身清单 |
| `*` | NotFound | 404 页面 |

### 3.4 数据模型

#### 训练数据
```typescript
interface ExerciseLine {
  id: string;
  sets: string;
  reps: string;
  weight: string;
  notes?: string;
}

interface Exercise {
  id: string;
  name: string;
  lines: ExerciseLine[];
}

interface TrainingDay {
  id: string;
  date: string;
  week: number;
  dayOfWeek: number;     // 1=周一, 7=周日
  type: 'squat' | 'deadlift' | 'rest';
  label: string;
  exercises: Exercise[];
  completed: boolean;
}

interface TrainingWeek {
  weekNumber: number;
  dateRange: string;
  days: TrainingDay[];
}
```

#### 热身数据
```typescript
interface WarmupExercise {
  name: string;
  instructions: string[];  // 分步指导
  note?: string;
}

interface WarmupPhase {
  title: string;
  subtitle: string;
  icon: string;
  exercises: WarmupExercise[];
}

interface ExecutionNote {
  icon: string;
  text: string;
}
```

### 3.5 数据存储
- 训练数据硬编码在 `trainingData.ts` 中
- 热身数据硬编码在 `warmupData.ts` 中
- 完成状态通过 `localStorage` 持久化

---

## 4. 设计系统

### 4.1 配色
| 用途 | 颜色 | 说明 |
|------|------|------|
| 背景 | 深蓝灰 `oklch(0.16 0.01 260)` | 深色运动主题 |
| 主色调 | 活力橙 `oklch(0.65 0.2 45)` | 按钮、高亮、当天标识 |
| 蹲推 | 红色 `oklch(0.55 0.2 25)` | 蹲推日数字颜色 |
| 硬拉 | 蓝色 `oklch(0.55 0.18 260)` | 硬拉日数字颜色 |
| 休息 | 灰色 `oklch(0.6 0.01 260)` | 休息日数字颜色 |
| 成功 | 绿色 `oklch(0.55 0.15 155)` | 完成标记 |
| 警告 | 黄色 `oklch(0.7 0.18 55)` | 备注文字 |

### 4.2 字体
- **Barlow Condensed**: 标题、日历数字、标签
- **Barlow**: 正文、动作名称

### 4.3 动效
- 月份切换：水平滑动 (250ms ease)
- 详情展开：高度动画 (250ms ease)
- 按钮点击：缩放反馈
- 页面进入：上滑淡入 (slide-up)

---

## 5. 添加新内容

### 5.1 添加新动作到现有训练日
在 `frontend/src/data/trainingData.ts` 中找到对应日期的 `exercises` 数组，添加：
```typescript
ex('新动作名', ['3', '10', '50kg']),
```

### 5.2 添加新训练日
在对应周的 `days` 数组中添加 `TrainingDay` 对象。

### 5.3 添加新周/新月份
在 `defaultTrainingData` 数组中添加新的 `TrainingWeek` 对象即可，日历会自动识别新月份。

### 5.4 更新热身清单
修改 `frontend/src/data/warmupData.ts`，在对应阶段的 `exercises` 数组中增删改动作，或在 `warmupPhases` 中添加新阶段。

---

## 6. 部署说明

### 6.1 仓库
- GitHub: `doulbeo/training-calendar`
- 线上地址: `https://training.doulbeo.com`

### 6.2 部署流程
1. 代码推送到 GitHub `main` 分支
2. Vercel 自动检测并触发部署
3. 构建成功即自动上线

### 6.3 Vercel 项目配置
| 配置项 | 值 |
|--------|-----|
| Framework | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### 6.4 本地运行
```bash
cd frontend
npm install
npm run dev
```

### 6.5 生产构建
```bash
cd frontend
npm run build
# 输出在 frontend/dist/ 目录
```

---

## 7. 版本记录

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0 | 2026-08-04 | 初始版本，三周训练日历 |
| v1.1 | 2026-08-04 | 简化为纯查看模式，添加周几标注 |
| v1.2 | 2026-08-04 | 日历视图放大，点击查看动作 |
| v1.3 | 2026-08-04 | 按月切换，左右滑动 |
| v1.4 | 2026-08-04 | 默认选中当天 |
| v1.5 | 2026-08-04 | 当天/选中视觉效果增强 |
| v1.6 | 2026-08-04 | 当天改为真实系统时间 |
| v1.7 | 2026-08-05 | 纯数字颜色区分训练类型 |
| v2.0 | 2026-08-07 | 新增热身清单页面（四阶段）、部署至 Vercel + training.doulbeo.com、lockfile 切换为 npm |
