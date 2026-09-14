import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly existingTrackingEm: number;
  readonly callerIncreaseEm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "existingTrackingEm", label: "Existing tracking em", kind: "number" },
  { id: "callerIncreaseEm", label: "Caller increase em", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return { adjustedTrackingEm: i.existingTrackingEm + i.callerIncreaseEm };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { existingTrackingEm: 0.02, callerIncreaseEm: 0.03 },
  output: { result: { adjustedTrackingEm: 0.05 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/uppercase-acronym-tracking-increase",
  title: "Uppercase Acronym Tracking Increase",
  description:
    "Add caller chosen uppercase-acronym tracking adjustment; no font-specific recommendation.",
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
