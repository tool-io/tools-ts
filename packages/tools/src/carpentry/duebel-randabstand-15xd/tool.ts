import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{ readonly actualNamedDowelDiameterMm: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualNamedDowelDiameterMm",
    label: "Actual named dowel diameter mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualNamedDowelDiameterMm, "actualNamedDowelDiameterMm");
  return { value: 1.5 * input.actualNamedDowelDiameterMm };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualNamedDowelDiameterMm: 8 },
  output: { result: { value: 12 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "carpentry/duebel-randabstand-15xd",
  title: "D\u00fcbel Randabstand 1,5xD Calculator",
  description:
    "Named1.5\u00d7dowel-diameter illustrative edge offset only, not DIN/EN universal safe edge-distance or structural capacity. Actual independently verified stock/tool/hardware, matching units and applicability; not safe machine setting, capacity certification, code compliance or automatically approved fabrication.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
