export interface WarmupExercise {
  name: string;
  description: string;
  reps: string;
  tips?: string;
}

export interface WarmupCategory {
  title: string;
  icon: string;
  exercises: WarmupExercise[];
}

export const warmupCategories: WarmupCategory[] = [
  {
    title: "通用激活",
    icon: "🔥",
    exercises: [
      {
        name: "开合跳",
        description: "全身性热身，提升心率和体温",
        reps: "30秒 × 2组",
        tips: "保持核心收紧，落地轻巧",
      },
      {
        name: "高抬腿",
        description: "激活髋屈肌，提升下肢血液循环",
        reps: "20次/侧 × 2组",
        tips: "大腿尽量抬至水平，核心稳定",
      },
      {
        name: "登山者",
        description: "核心稳定 + 心肺激活",
        reps: "30秒 × 2组",
        tips: "保持背部平直，不要塌腰",
      },
    ],
  },
  {
    title: "下肢热身",
    icon: "🦵",
    exercises: [
      {
        name: "自重深蹲",
        description: "激活臀腿肌群，建立深蹲模式",
        reps: "15次 × 2组",
        tips: "控制下蹲速度，底部停顿1秒",
      },
      {
        name: "弓步蹲",
        description: "单侧稳定性 + 髋关节活动度",
        reps: "10次/侧 × 2组",
        tips: "前膝不超过脚尖，后膝轻触地面",
      },
      {
        name: "侧弓步",
        description: "髋关节横向活动度",
        reps: "10次/侧 × 2组",
        tips: "重心放低，保持躯干直立",
      },
      {
        name: "臀桥",
        description: "激活臀大肌和后链",
        reps: "15次 × 2组",
        tips: "顶峰收缩2秒，感受臀部发力",
      },
      {
        name: "最伟大拉伸",
        description: "全身动态拉伸，改善髋胸活动度",
        reps: "5次/侧",
        tips: "弓步姿势 → 手肘触地 → 转体抬手",
      },
    ],
  },
  {
    title: "上肢热身",
    icon: "💪",
    exercises: [
      {
        name: "肩部环绕",
        description: "打开肩关节活动度",
        reps: "10次/方向 × 2组",
        tips: "幅度由小到大，感受肩关节活动",
      },
      {
        name: "弹力带肩部拉伸",
        description: "激活肩袖肌群和后肩",
        reps: "15次 × 2组",
        tips: "保持肘关节伸直，控制回程",
      },
      {
        name: "跪姿俯卧撑",
        description: "激活胸肌和肱三头肌",
        reps: "10次 × 2组",
        tips: "手肘45°外展，核心收紧",
      },
      {
        name: "猫牛式",
        description: "脊柱活动度 + 核心激活",
        reps: "8次 × 2组",
        tips: "动作缓慢，配合呼吸（吸气伸展、呼气拱背）",
      },
    ],
  },
  {
    title: "核心激活",
    icon: "🎯",
    exercises: [
      {
        name: "死虫式",
        description: "核心抗旋转 + 四肢协调",
        reps: "10次/侧 × 2组",
        tips: "腰部始终贴地，慢速控制",
      },
      {
        name: "鸟狗式",
        description: "核心稳定 + 对侧协调",
        reps: "8次/侧 × 2组",
        tips: "保持骨盆稳定不翻转",
      },
      {
        name: "平板支撑",
        description: "静态核心耐力",
        reps: "30秒 × 2组",
        tips: "身体一条直线，不要塌腰或弓背",
      },
    ],
  },
  {
    title: "专项激活",
    icon: "🏋️",
    exercises: [
      {
        name: "空杆深蹲",
        description: "正式组前的神经激活和动作模式巩固",
        reps: "8次 × 2-3组",
        tips: "专注动作质量，节奏控制",
      },
      {
        name: "空杆卧推",
        description: "激活胸肩肌群和运动模式",
        reps: "8次 × 2-3组",
        tips: "肩胛骨收紧，控制离心",
      },
      {
        name: "弹力带髋关节激活",
        description: "激活臀中肌提高髋关节稳定性",
        reps: "15次/侧 × 2组",
        tips: "保持躯干稳定，仅髋关节外展",
      },
    ],
  },
];
