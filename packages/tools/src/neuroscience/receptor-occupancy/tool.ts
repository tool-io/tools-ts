import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualFreeLigandConcentration: number;
  readonly callerIndependentOneSiteKd: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualFreeLigandConcentration",
    label: "Actual free ligand concentration",
    kind: "number",
  },
  {
    id: "callerIndependentOneSiteKd",
    label: "Caller independent one site kd",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualFreeLigandConcentration,
    "actualFreeLigandConcentration",
  );
  positive(input.callerIndependentOneSiteKd, "callerIndependentOneSiteKd");
  return {
    value:
      input.actualFreeLigandConcentration /
      (input.actualFreeLigandConcentration + input.callerIndependentOneSiteKd),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualFreeLigandConcentration: 2, callerIndependentOneSiteKd: 2 },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/receptor-occupancy",
  title: "Receptor Occupancy Calculator",
  description:
    "Restricted non cooperative one-site fractionaloccupancyfreeC/(C+Kd), equilibrium matched same units, no receptor reserve/depletion/clinical receptor inference. Actual independently matched observations/units and protocol, not diagnosis, causal mechanism, clinical decision or validated individual prediction.",
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
