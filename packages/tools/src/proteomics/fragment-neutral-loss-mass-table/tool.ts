import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  positive,
} from "../batch53-shared.js";

export type Input = Readonly<{ fragmentMz: number; charge: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fragmentMz", label: "Fragment mz", kind: "number" },
  { id: "charge", label: "Charge", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(i.fragmentMz, "mz");
  bounded(i.charge, "charge", 1, 100);
  const water = 18.01056468403,
    ammonia = 17.02654910112;
  if (i.fragmentMz <= water / i.charge)
    simpleError("mass", "Positive post-loss mass required.");
  return {
    waterLossMz: i.fragmentMz - water / i.charge,
    ammoniaLossMz: i.fragmentMz - ammonia / i.charge,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { fragmentMz: 100, charge: 2 },
  output: {
    result: { waterLossMz: 90.994717657985, ammoniaLossMz: 91.48672544944 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/fragment-neutral-loss-mass-table",
  title: "Neutral Loss Water and Ammonia Fragment Mass Table",
  description:
    "Tabulate monoisotopic H2O/NH3 neutral-loss m/z shifts for a stated positive charge; does not predict whether a fragment loses either species.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
