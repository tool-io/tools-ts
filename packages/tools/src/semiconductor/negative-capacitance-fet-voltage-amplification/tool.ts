import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerPositiveSeriesCapacitanceFarads: number;
  readonly callerNegativeDifferentialCapacitanceFarads: number;
}>;
export type Output = Readonly<{
  readonly idealLocalNcVoltageAmplification: number;
  readonly positiveTotalSeriesCapacitanceFarads: number;
}>;
const inputFields = [
  {
    id: "callerPositiveSeriesCapacitanceFarads",
    label: "Caller positive series capacitance farads",
    kind: "number",
  },
  {
    id: "callerNegativeDifferentialCapacitanceFarads",
    label: "Caller negative differential capacitance farads",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerPositiveSeriesCapacitanceFarads,
    "callerPositiveSeriesCapacitanceFarads",
  );
  if (
    input.callerNegativeDifferentialCapacitanceFarads >=
    -input.callerPositiveSeriesCapacitanceFarads
  )
    simpleError(
      "capacitance",
      "Explicit local branch Cneg<−Cpositive required for positive series stiffness.",
    );
  const gain =
    input.callerNegativeDifferentialCapacitanceFarads /
    (input.callerNegativeDifferentialCapacitanceFarads +
      input.callerPositiveSeriesCapacitanceFarads);
  return {
    idealLocalNcVoltageAmplification: gain,
    positiveTotalSeriesCapacitanceFarads:
      gain * input.callerPositiveSeriesCapacitanceFarads,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPositiveSeriesCapacitanceFarads: 1,
  callerNegativeDifferentialCapacitanceFarads: -2,
} satisfies Input;
export const exampleOutput = {
  idealLocalNcVoltageAmplification: 2,
  positiveTotalSeriesCapacitanceFarads: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/negative-capacitance-fet-voltage-amplification",
  title:
    "Semiconductor Negative Capacitance Fet Voltage Amplification Calculator",
  description:
    "Local explicit positive/negative series differential-capacitance gain under positive-total-stiffness branch, no global ferroelectric stability/hysteresis or circuit operating certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "idealLocalNcVoltageAmplification",
      label: "Ideal local nc voltage amplification",
      kind: "number",
    },
    {
      id: "positiveTotalSeriesCapacitanceFarads",
      label: "Positive total series capacitance farads",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerPositiveSeriesCapacitanceFarads:
        value.callerPositiveSeriesCapacitanceFarads as number,
      callerNegativeDifferentialCapacitanceFarads:
        value.callerNegativeDifferentialCapacitanceFarads as number,
    }),
});
export const run = tool.execute;
export default tool;
