# 训练日历 — 产品需求文档 (PRD)

## 1. 产品概述

### 1.1 产品定位
一款移动端力量训练计划查看工具，帮助用户按日历形式浏览每日训练安排，支持按月切换、点击查看动作详情。

### 1.2 目标用户
- 力量训练爱好者，有固定的周期性训练计划
- 需要随时在手机上查看当天的训练内容

### 1.3 核心价值
- 训练计划一目了然，日历视图直观呈现
- 点击任意训练日即可查看完整动作列表
- 按月切换，支持长期训练计划扩展
- 自动识别当天日期，打开即定位到当日训练

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
| 部署 | 静态站点，任意 HTTP Server |

### 3.2 项目结构
```
frontend/src/
├── components/
│   ├── training/
│   │   ├── CalendarView.tsx    # 月历主组件
│   │   ├── DayCard.tsx         # 训练日卡片（备用）
│   │   └── ProgressBar.tsx     # 进度条（备用）
│   ├── MotionPrimitives.tsx    # 动画基础组件
│   ├── PageTransition.tsx      # 页面切换动画
│   └── AnimatedRoutes.tsx      # 路由动画
├── data/
│   └── trainingData.ts         # 训练数据（所有训练计划）
├── hooks/
│   └── useTraining.ts          # 训练数据状态管理
├── pages/
│   └── Index.tsx               # 首页
├── types/
│   └── training.ts             # 类型定义
├── index.css                   # 全局样式 + 设计系统
└── main.tsx                    # 入口文件
```

### 3.3 数据模型
```typescript
interface ExerciseLine {
  id: string;
  sets: string;    // 组数
  reps: string;    // 次数
  weight: string;  // 重量
  notes?: string;  // 备注
}

interface Exercise {
  id: string;
  name: string;           // 动作名称
  lines: ExerciseLine[];  // 多行组合（如热身组+正式组）
}

interface TrainingDay {
  id: string;
  date: string;          // 如 "8月5日"
  week: number;
  dayOfWeek: number;     // 1=周一, 7=周日
  type: 'squat' | 'deadlift' | 'rest';
  label: string;         // 如 "蹲推训练（第9练）"
  exercises: Exercise[];
  completed: boolean;
}

interface TrainingWeek {
  weekNumber: number;
  dateRange: string;     // 如 "0805-0811"
  days: TrainingDay[];
}
```

### 3.4 数据存储
- 训练数据硬编码在 `trainingData.ts` 中
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

---

## 5. 添加新训练计划

### 5.1 添加新动作到现有训练日
在 `frontend/src/data/trainingData.ts` 中找到对应日期的 `exercises` 数组，添加：
```typescript
ex('新动作名', ['3', '10', '50kg']),
```

### 5.2 添加新训练日
在对应周的 `days` 数组中添加：
```typescript
{
  id: 'w3dN',  // w3 = 第3周, dN = 第N天
  date: '8月N日',
  week: 3,
  dayOfWeek: N,  // 1=周一
  type: 'squat',  // squat / deadlift / rest
  label: '蹲推训练（第N练）',
  completed: false,
  exercises: setId('w3dN', [ ... ]),
}
```

### 5.3 添加新周/新月份
在 `defaultTrainingData` 数组中添加新的 `TrainingWeek` 对象即可，日历会自动识别新月份。

---

## 6. 部署说明

### 本地运行
```bash
cd frontend
pnpm install
pnpm dev
```

### 生产构建
```bash
cd frontend
pnpm build
# 输出在 dist/ 目录，部署到任意静态服务器
```

### 当前线上地址
https://a60558133b15b346f.gz4.agentos-app.net

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
