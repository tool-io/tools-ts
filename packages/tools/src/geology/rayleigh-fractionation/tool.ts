import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualRemainingMeltFraction: number;
  readonly callerMatchedBulkPartitionCoefficient: number;
  readonly actualInitialTraceConcentration: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRemainingMeltFraction",
    label: "Actual remaining melt fraction",
    kind: "number",
  },
  {
    id: "callerMatchedBulkPartitionCoefficient",
    label: "Caller matched bulk partition coefficient",
    kind: "number",
  },
  {
    id: "actualInitialTraceConcentration",
    label: "Actual initial trace concentration",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(input.actualRemainingMeltFraction, "remainingmelt");
  positive(input.actualRemainingMeltFraction, "remainingmelt");
  nonnegative(input.callerMatchedBulkPartitionCoefficient, "bulkD");
  nonnegative(input.actualInitialTraceConcentration, "C0");
  return {
    conditionalRayleighResidualMeltConcentration:
      input.actualInitialTraceConcentration *
      input.actualRemainingMeltFraction **
        (input.callerMatchedBulkPartitionCoefficient - 1),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualRemainingMeltFraction: 0.5,
    callerMatchedBulkPartitionCoefficient: 2,
    actualInitialTraceConcentration: 10,
  },
  output: { result: { conditionalRayleighResidualMeltConcentration: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/rayleigh-fractionation",
  title: "Geology Rayleigh Fractionation Calculator",
  description:
    "Ideal Rayleigh fractional-crystallization residual liquid C=C0F^(D\u22121), independently constant bulk Dand actual remaining melt fraction. Not closed equilibrium melting, cumulate average or fitted actual petrogenesis.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
