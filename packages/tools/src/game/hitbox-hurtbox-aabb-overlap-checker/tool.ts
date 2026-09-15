import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  range,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly hitboxMin: readonly number[];
  readonly hitboxMax: readonly number[];
  readonly hurtboxMin: readonly number[];
  readonly hurtboxMax: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "hitboxMin", label: "Hitbox min", kind: "numberList" },
  { id: "hitboxMax", label: "Hitbox max", kind: "numberList" },
  { id: "hurtboxMin", label: "Hurtbox min", kind: "numberList" },
  { id: "hurtboxMax", label: "Hurtbox max", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  const n = i.hitboxMin.length;
  if (n !== 2 && n !== 3) simpleError("axes", "2D or 3D vectors.");
  for (const a of [i.hitboxMax, i.hurtboxMin, i.hurtboxMax])
    if (a.length !== n) simpleError("axes", "Matched dimensions.");
  for (let j = 0; j < n; j++) {
    range([i.hitboxMin[j], i.hitboxMax[j]], "hitbox");
    range([i.hurtboxMin[j], i.hurtboxMax[j]], "hurtbox");
  }
  return {
    positiveVolumeOverlap: i.hitboxMin.every(
      (v, j) =>
        Math.max(v, i.hurtboxMin[j]) <
        Math.min(i.hitboxMax[j], i.hurtboxMax[j]),
    ),
    closedSetContact: i.hitboxMin.every(
      (v, j) =>
        Math.max(v, i.hurtboxMin[j]) <=
        Math.min(i.hitboxMax[j], i.hurtboxMax[j]),
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    hitboxMin: [0, 0, 0],
    hitboxMax: [2, 2, 2],
    hurtboxMin: [1, 1, 1],
    hurtboxMax: [3, 3, 3],
  },
  output: { result: { positiveVolumeOverlap: true, closedSetContact: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/hitbox-hurtbox-aabb-overlap-checker",
  title: "Hitbox/Hurtbox AABB Overlap Check",
  description:
    "2D/3D axis-aligned hitbox/hurtbox overlap and contact flags; no game collision response, swept motion or invulnerability logic.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
