import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  integer,
  aligned,
  strictlyIncreasing,
  linearFit,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedTransitTimesDays: readonly number[];
  readonly callerIntegerCycleOrdinals: readonly number[];
}>;
export type Output = Readonly<{
  readonly leastSquaresOrbitalPeriodDays: number;
  readonly transitTimingResidualsDays: readonly number[];
}>;
const inputFields = [
  {
    id: "observedTransitTimesDays",
    label: "Observed transit times days",
    kind: "numberList",
  },
  {
    id: "callerIntegerCycleOrdinals",
    label: "Caller integer cycle ordinals",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedTransitTimesDays,
    input.callerIntegerCycleOrdinals,
    "events",
  );
  strictlyIncreasing(input.callerIntegerCycleOrdinals, "cycles");
  input.callerIntegerCycleOrdinals.forEach((v) => integer(v, "cycle"));
  const fit = linearFit(
    input.callerIntegerCycleOrdinals,
    input.observedTransitTimesDays,
  );
  positive(fit.slope, "period");
  return {
    leastSquaresOrbitalPeriodDays: fit.slope,
    transitTimingResidualsDays: input.observedTransitTimesDays.map(
      (v, i) =>
        v - fit.intercept - fit.slope * input.callerIntegerCycleOrdinals[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTransitTimesDays: [0, 10, 30],
  callerIntegerCycleOrdinals: [0, 1, 3],
} satisfies Input;
export const exampleOutput = {
  leastSquaresOrbitalPeriodDays: 10,
  transitTimingResidualsDays: [0, 0, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/exoplanet-period-from-transit-spacing",
  title: "Exoplanet Period From Transit Spacing",
  description:
    "Transit timing linear fit with independently identified missing-cycle ordinals, not average adjacent gaps or automatic integer-cycle resolution. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "leastSquaresOrbitalPeriodDays",
      label: "Least squares orbital period days",
      kind: "number",
    },
    {
      id: "transitTimingResidualsDays",
      label: "Transit timing residuals days",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTransitTimesDays:
        value.observedTransitTimesDays as readonly number[],
      callerIntegerCycleOrdinals:
        value.callerIntegerCycleOrdinals as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
