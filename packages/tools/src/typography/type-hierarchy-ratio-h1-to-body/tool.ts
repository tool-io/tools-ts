import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly headingPx: number;
  readonly bodyPx: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "headingPx", label: "Heading px", kind: "number" },
  { id: "bodyPx", label: "Body px", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  positive(i.headingPx, "size");
  positive(i.bodyPx, "body");
  return { sizeRatio: i.headingPx / i.bodyPx };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { headingPx: 12, bodyPx: 16 },
  output: { result: { sizeRatio: 0.75 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/type-hierarchy-ratio-h1-to-body",
  title: "H1-to-Body Hierarchy Ratio",
  description:
    "Measured headingPx to body size ratio, not an accessibility or style prescription.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { sizeRatio: { type: "number" } },
        required: ["sizeRatio"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
