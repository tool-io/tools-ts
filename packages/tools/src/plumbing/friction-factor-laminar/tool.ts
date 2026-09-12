import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch49-shared.js";
export type Input = Readonly<{ readonly actualReynoldsNumber: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualReynoldsNumber",
    label: "Actual reynolds number",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualReynoldsNumber, "actualReynoldsNumber");
  if (input.actualReynoldsNumber >= 2000)
    simpleError("regime", "DeclaredlaminarRe<2000branch.");
  return { value: 64 / input.actualReynoldsNumber };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualReynoldsNumber: 1000 },
  output: { result: { value: 0.064 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/friction-factor-laminar",
  title: "Plumbing Friction Factor Laminar Calculator",
  description:
    "Restricted laminar full circular pipe DARCY factor64/Re, independently matched Newtonian fullydevelopedRe<2000branch; no turbulent/transition substitution. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
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
