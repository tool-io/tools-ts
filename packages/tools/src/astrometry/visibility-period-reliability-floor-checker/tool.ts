import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedDistinctVisibilityPeriods: number;
  readonly callerReleaseSpecificMinimum: number;
}>;
export type Output = Readonly<{
  readonly signedVisibilityPeriodReserve: number;
  readonly callerPeriodFloorReached: boolean;
}>;
const inputFields = [
  {
    id: "observedDistinctVisibilityPeriods",
    label: "Observed distinct visibility periods",
    kind: "number",
  },
  {
    id: "callerReleaseSpecificMinimum",
    label: "Caller release specific minimum",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.observedDistinctVisibilityPeriods, "periods", 0, 10000);
  bounded(input.callerReleaseSpecificMinimum, "floor", 1, 10000);
  return {
    signedVisibilityPeriodReserve:
      input.observedDistinctVisibilityPeriods -
      input.callerReleaseSpecificMinimum,
    callerPeriodFloorReached:
      input.observedDistinctVisibilityPeriods >=
      input.callerReleaseSpecificMinimum,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDistinctVisibilityPeriods: 8,
  callerReleaseSpecificMinimum: 9,
} satisfies Input;
export const exampleOutput = {
  signedVisibilityPeriodReserve: -1,
  callerPeriodFloorReached: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/visibility-period-reliability-floor-checker",
  title: "Visibility Period Count Reliability Floor Checker",
  description:
    "Independent count of separated visibility periods vs caller release-specific floor; count does not prove reliability or replace observations count. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedVisibilityPeriodReserve",
      label: "Signed visibility period reserve",
      kind: "number",
    },
    {
      id: "callerPeriodFloorReached",
      label: "Caller period floor reached",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDistinctVisibilityPeriods:
        value.observedDistinctVisibilityPeriods as number,
      callerReleaseSpecificMinimum:
        value.callerReleaseSpecificMinimum as number,
    }),
});
export const run = tool.execute;
export default tool;
