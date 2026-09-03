import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly sourceBrownieInteriorLengthCm: number;
  readonly sourceBrownieInteriorWidthCm: number;
  readonly targetBrownieInteriorLengthCm: number;
  readonly targetBrownieInteriorWidthCm: number;
  readonly callerTargetDepthRatio: number;
}>;
export type Output = Readonly<{ readonly conditionalBatchScale: number }>;
const inputFields = [
  {
    id: "sourceBrownieInteriorLengthCm",
    label: "Source brownie interior length cm",
    kind: "number",
  },
  {
    id: "sourceBrownieInteriorWidthCm",
    label: "Source brownie interior width cm",
    kind: "number",
  },
  {
    id: "targetBrownieInteriorLengthCm",
    label: "Target brownie interior length cm",
    kind: "number",
  },
  {
    id: "targetBrownieInteriorWidthCm",
    label: "Target brownie interior width cm",
    kind: "number",
  },
  {
    id: "callerTargetDepthRatio",
    label: "Caller target depth ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.sourceBrownieInteriorLengthCm,
    "sourceBrownieInteriorLengthCm",
  );
  positive(input.sourceBrownieInteriorWidthCm, "sourceBrownieInteriorWidthCm");
  positive(
    input.targetBrownieInteriorLengthCm,
    "targetBrownieInteriorLengthCm",
  );
  positive(input.targetBrownieInteriorWidthCm, "targetBrownieInteriorWidthCm");
  positive(input.callerTargetDepthRatio, "callerTargetDepthRatio");
  return {
    conditionalBatchScale:
      ((input.targetBrownieInteriorLengthCm *
        input.targetBrownieInteriorWidthCm) /
        (input.sourceBrownieInteriorLengthCm *
          input.sourceBrownieInteriorWidthCm)) *
      input.callerTargetDepthRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sourceBrownieInteriorLengthCm: 20,
  sourceBrownieInteriorWidthCm: 10,
  targetBrownieInteriorLengthCm: 30,
  targetBrownieInteriorWidthCm: 20,
  callerTargetDepthRatio: 0.5,
} satisfies Input;
export const exampleOutput = { conditionalBatchScale: 1.5 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/brownie-pan-adjustment",
  title: "Cooking Brownie Pan Adjustment Calculator",
  description:
    "Rectangular brownie-pan interior area ratio with explicit changed-depth factor, not fixed time multiplier or round-square alias. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalBatchScale",
      label: "Conditional batch scale",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sourceBrownieInteriorLengthCm:
        value.sourceBrownieInteriorLengthCm as number,
      sourceBrownieInteriorWidthCm:
        value.sourceBrownieInteriorWidthCm as number,
      targetBrownieInteriorLengthCm:
        value.targetBrownieInteriorLengthCm as number,
      targetBrownieInteriorWidthCm:
        value.targetBrownieInteriorWidthCm as number,
      callerTargetDepthRatio: value.callerTargetDepthRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
