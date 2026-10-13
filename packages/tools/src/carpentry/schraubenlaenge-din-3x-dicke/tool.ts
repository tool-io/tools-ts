import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualAttachedStockThicknessMm: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualAttachedStockThicknessMm",
    label: "Actual attached stock thickness mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(
    input.actualAttachedStockThicknessMm,
    "actualAttachedStockThicknessMm",
  );
  return { value: 3 * input.actualAttachedStockThicknessMm };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualAttachedStockThicknessMm: 10 },
  output: { result: { value: 30 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "carpentry/schraubenlaenge-din-3x-dicke",
  title: "Schraubenl\u00e4nge 3x Dicke Calculator",
  description:
    "Explicit3\u00d7stock thickness nominal screw length HEURISTIC, not established DIN rule or hardware connection design, available lengths/embedment/edge/split risk external. Actual independently verified stock/tool/hardware, matching units and applicability; not safe machine setting, capacity certification, code compliance or automatically approved fabrication.",
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
