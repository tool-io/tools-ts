import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly initialErrorArcminutes: number;
  readonly observedMonthlyDriftArcminutes: number;
  readonly elapsedMonths: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "initialErrorArcminutes",
    label: "Initial error arcminutes",
    kind: "number",
  },
  {
    id: "observedMonthlyDriftArcminutes",
    label: "Observed monthly drift arcminutes",
    kind: "number",
  },
  { id: "elapsedMonths", label: "Elapsed months", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.elapsedMonths, "months");
  return {
    projectedSignedErrorArcminutes:
      i.initialErrorArcminutes +
      i.observedMonthlyDriftArcminutes * i.elapsedMonths,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    initialErrorArcminutes: 2,
    observedMonthlyDriftArcminutes: -0.5,
    elapsedMonths: 4,
  },
  output: { result: { projectedSignedErrorArcminutes: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/polar-alignment-drift-monthly-tracker",
  title: "Polar Axis Alignment Drift Arcminutes per Month Tracker",
  description:
    "Signed linear polar-alignment drift tracker using caller measured monthly rate; no mount geometry or sky drift inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
