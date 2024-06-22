export type Type = number;

export const UnknowType = /*              */ 0b00000000_00000000;
export const InteractionType = /*         */ 0b00000000_00000001;
export const TextType = /*                */ 0b00000000_00000010;
export const SpeechType = /*              */ 0b00000000_00000100;
export const OptionType = /*              */ 0b00000000_00001000;
export const ResourceType = /*            */ 0b00000000_00010000;
export const HitType = /*                 */ 0b00000000_00100000;
export const InvalidQuestionType = /*     */ 0b00000000_01000000;
export const InvalidAnswerType = /*       */ 0b00000000_10000000;
export const AbandonType = /*             */ 0b00000001_00000000;

export const InvalidHitType = HitType | AbandonType;
export const ReplyType =
  InteractionType | TextType | SpeechType | OptionType | ResourceType;

// 添加类型
export function mergeType(a: Type, b: Type): Type {
  return a | b;
}

// 移除类型
export function removeType(set: Type, subset: Type): Type {
  return set & ~subset;
}

// 已知 id 与 类型，查出对象并赋值
export function resolveType(id: string, type: Type) {}

// 已知 id 与 对象，查出类型并赋值
export function determineType(id: string, obj: Record<string, any>) {}

// 类型转成对应的类型字符
export function typeToString(type: Type) {
  const typeString: string[] = [];
  if (type === UnknowType) {
    return "UnknowType";
  }
  const Types = [
    InteractionType,
    TextType,
    SpeechType,
    OptionType,
    ResourceType,
    HitType,
    InvalidQuestionType,
    InvalidAnswerType,
    AbandonType,
  ];
  const TypeStrings = [
    "InteractionType",
    "TextType",
    "SpeechType",
    "OptionType",
    "ResourceType",
    "HitType",
    "InvalidQuestionType",
    "InvalidAnswerType",
    "AbandonType",
  ];
  Types.forEach((TypeItem, i) => {
    if ((type & TypeItem) === TypeItem) {
      typeString.push(TypeStrings[i]);
    }
  });
  return typeString.join(" | ");
}
