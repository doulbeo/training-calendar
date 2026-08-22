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
- 第5周（0821-0827）：第11-14练

## 更新流程
1. 远子发新计划 → 解析日期和动作 → 按格式追加到 trainingData.ts
2. cd frontend && npm run build 验证编译
3. node_modules/.bin/vite preview --port <N> 启动预览
4. present_files 展示结果

## 部署与云端协作
- 仓库：https://github.com/doulbeo/training-calendar（main 分支）
- 线上地址：https://training-calendar-beta.vercel.app，push 后 Vercel 自动部署（1-2 分钟）
- git push 需 dangerouslyDisableSandbox 绕过沙箱网络限制
- 云端协作流程（小程序端）：WorkBuddy 小程序 → 云端工作模式 → 从 GitHub 拉取仓库 → 改 trainingData.ts → push 回 GitHub → Vercel 自动部署
- 云端沙箱无本地记忆，靠仓库内本文件（MEMORY.md）提供格式约定；每次云端任务须重新拉取仓库
- 电脑端重新接手时先 git pull，避免两端同时修改冲突
