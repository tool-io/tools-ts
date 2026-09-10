import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyRecordedPrepregnancyWeightKg: number;
  readonly currentMaternalWeightKg: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyRecordedPrepregnancyWeightKg",
    label: "Independently recorded prepregnancy weight kg",
    kind: "number",
  },
  {
    id: "currentMaternalWeightKg",
    label: "Current maternal weight kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.independentlyRecordedPrepregnancyWeightKg, "baseline");
  positive(input.currentMaternalWeightKg, "weight");
  return {
    signedTotalMaternalWeightChangeKg:
      input.currentMaternalWeightKg -
      input.independentlyRecordedPrepregnancyWeightKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyRecordedPrepregnancyWeightKg: 60,
    currentMaternalWeightKg: 65,
  },
  output: { result: { signedTotalMaternalWeightChangeKg: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/maternal-weight-gain-total",
  title: "Total Maternal Weight Gain Calculator",
  description:
    "Actual signed maternal weight change against independently recorded prepregnancy baseline; no recommended gain, body-fat attribution or fetal health conclusion.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
