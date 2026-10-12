import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredLamellaJointGapMm: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualMeasuredLamellaJointGapMm",
    label: "Actual measured lam ella joint gap mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(
    input.actualMeasuredLamellaJointGapMm,
    "actualMeasuredLamellaJointGapMm",
  );
  return { value: input.actualMeasuredLamellaJointGapMm - 0.1 };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualMeasuredLamellaJointGapMm: 0.2 },
  output: { result: { value: 0.1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "carpentry/lamellen-fugenbreite-01mm",
  title: "Lamellen Fugenbreite 0,1mm Calculator",
  description:
    "Signed measured lam ella gap minus TITLE named0.1mm reference, not universal glue line acceptance or a stock dimension prescription. Actual independently verified stock/tool/hardware, matching units and applicability; not safe machine setting, capacity certification, code compliance or automatically approved fabrication.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
