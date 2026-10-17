import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{ readonly rollingCircleRadius: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "rollingCircleRadius", label: "Rolling circle radius", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(input.rollingCircleRadius, "rollingCircleRadius");
  return { value: 12 * Math.PI * input.rollingCircleRadius ** 2 };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { rollingCircleRadius: 1 },
  output: { result: { value: 37.69911184307752 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/nephroid-area",
  title: "Nephroid Area Calculator",
  description:
    "Nephroidepicycloidarea12\u03c0a\u00b2whereaisrollingradius and fixed radius2a.",
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
