import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualCountertopFaceCoordinateMm: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualCountertopFaceCoordinateMm",
    label: "Actual counter top face coordinate mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  return { value: input.actualCountertopFaceCoordinateMm + 20 };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualCountertopFaceCoordinateMm: 5 },
  output: { result: { value: 25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "carpentry/arbeitsplatte-tropfkante-ueberstand-20mm",
  title: "Arbeitsplatte Tropfkante \u00dcberstand 20mm Calculator",
  description:
    "TITLE named20mm drip edge overhang added to actual face coordinate, not universally sufficient drainage clearance. Actual independently verified stock/tool/hardware, matching units and applicability; not safe machine setting, capacity certification, code compliance or automatically approved fabrication.",
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
