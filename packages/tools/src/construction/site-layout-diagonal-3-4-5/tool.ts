import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualThreeFourFiveScale: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualThreeFourFiveScale",
    label: "Actual three four five scale",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(input.actualThreeFourFiveScale, "actualThreeFourFiveScale");
  return { value: 5 * input.actualThreeFourFiveScale };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualThreeFourFiveScale: 2 },
  output: { result: { value: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/site-layout-diagonal-3-4-5",
  title: "Site Layout Diagonal 3-4-5 Calculator",
  description:
    "Scaled3\u20134\u20135right angle layout diagonal5s, not survey-proof or carpenter angle from arbitrary legs. Actual independently established design/material/calibration and matched units; not a safe work instruction, code compliance or engineering approval.",
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
