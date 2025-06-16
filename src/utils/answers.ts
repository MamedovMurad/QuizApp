import type { Option } from "../models/quiz";

export function transformOrderingAnswer(answer: Option[]): Record<number, number> {
  const obj: Record<number, number> = {};
  answer.forEach((opt, index) => {
    obj[index] = opt.id;
  });
  return obj;
}
