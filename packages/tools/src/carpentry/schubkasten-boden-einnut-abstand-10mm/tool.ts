import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch49-shared.js";
export type Input = Readonly<{ readonly actualBottomPanelDatumMm: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualBottomPanelDatumMm",
    label: "Actual bottom panel datum mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return { value: input.actualBottomPanelDatumMm + 10 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualBottomPanelDatumMm: 5 },
  output: { result: { value: 15 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "carpentry/schubkasten-boden-einnut-abstand-10mm",
  title: "Schubkasten Boden Einnut Abstand 10mm Calculator",
  description:
    "TITLE named10mm inset from actual drawer bottom datum, one explicit coordinate orientation; not groove-depth recommendation or universal manufacturer requirement. Actual independently verified stock/tool/hardware, matching units and applicability; not safe machine setting, capacity certification, code compliance or automatically approved fabrication.",
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
