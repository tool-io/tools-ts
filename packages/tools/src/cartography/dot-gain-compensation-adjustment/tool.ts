import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, angle } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly targetTonePercent: number;
  readonly measuredGainPercentagePoints: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "targetTonePercent", label: "Target tone percent", kind: "number" },
  {
    id: "measuredGainPercentagePoints",
    label: "Measured gain percentage points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  angle(i.targetTonePercent, "tone", 0, 100);
  angle(i.measuredGainPercentagePoints, "gain", -100, 100);
  angle(
    i.targetTonePercent - i.measuredGainPercentagePoints,
    "corrected tone",
    0,
    100,
  );
  return {
    correctedTonePercent: i.targetTonePercent - i.measuredGainPercentagePoints,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { targetTonePercent: 50, measuredGainPercentagePoints: 10 },
  output: { result: { correctedTonePercent: 40 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/dot-gain-compensation-adjustment",
  title: "Dot Gain Compensation Percentage Adjustment Calculator",
  description:
    "Signed input-tone correction by measured dot gain; rejects corrected tone outside 0–100, no press transfer model.",
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
