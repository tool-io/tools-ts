import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
  strictlyIncreasing,
  interpolate,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedPressureStepTimes: readonly number[];
  readonly observedPressureStepDecreases: readonly number[];
  readonly callerVerifiedVehKernelLagTimes: readonly number[];
  readonly callerVerifiedVehDimensionlessResponses: readonly number[];
  readonly callerVolumePerPressureScale: number;
  readonly callerVehKernelConventionVerified: boolean;
}>;
export type Output = Readonly<{
  readonly vehSuperposedInfluxByStep: readonly number[];
}>;
const inputFields = [
  {
    id: "observedPressureStepTimes",
    label: "Observed pressure step times",
    kind: "numberList",
  },
  {
    id: "observedPressureStepDecreases",
    label: "Observed pressure step decreases",
    kind: "numberList",
  },
  {
    id: "callerVerifiedVehKernelLagTimes",
    label: "Caller verified veh kernel lag times",
    kind: "numberList",
  },
  {
    id: "callerVerifiedVehDimensionlessResponses",
    label: "Caller verified veh dimensionless responses",
    kind: "numberList",
  },
  {
    id: "callerVolumePerPressureScale",
    label: "Caller volume per pressure scale",
    kind: "number",
  },
  {
    id: "callerVehKernelConventionVerified",
    label: "Caller veh kernel convention verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerVolumePerPressureScale, "callerVolumePerPressureScale");
  input.observedPressureStepTimes.forEach((v) =>
    nonnegative(v, "observedPressureStepTimes"),
  );
  input.observedPressureStepDecreases.forEach((v) =>
    nonnegative(v, "observedPressureStepDecreases"),
  );
  input.callerVerifiedVehKernelLagTimes.forEach((v) =>
    nonnegative(v, "callerVerifiedVehKernelLagTimes"),
  );
  input.callerVerifiedVehDimensionlessResponses.forEach((v) =>
    nonnegative(v, "callerVerifiedVehDimensionlessResponses"),
  );
  aligned(
    input.observedPressureStepTimes,
    input.observedPressureStepDecreases,
    "steps",
  );
  strictlyIncreasing(input.observedPressureStepTimes, "times", 1);
  strictlyIncreasing(input.callerVerifiedVehKernelLagTimes, "kernel lags");
  if (
    !input.callerVehKernelConventionVerified ||
    input.callerVerifiedVehKernelLagTimes[0] !== 0 ||
    input.observedPressureStepTimes.length > 128
  )
    simpleError(
      "kernel",
      "Independently established VEH unit-step kernel beginning lag0 and≤128 pressure steps.",
    );
  return {
    vehSuperposedInfluxByStep: input.observedPressureStepTimes.map(
      (t, i) =>
        input.callerVolumePerPressureScale *
        sum(
          input.observedPressureStepTimes
            .slice(0, i + 1)
            .map(
              (s, j) =>
                input.observedPressureStepDecreases[j] *
                interpolate(
                  input.callerVerifiedVehKernelLagTimes,
                  input.callerVerifiedVehDimensionlessResponses,
                  t - s,
                ),
            ),
        ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPressureStepTimes: [0, 1, 2],
  observedPressureStepDecreases: [1, 2, 0],
  callerVerifiedVehKernelLagTimes: [0, 1, 2],
  callerVerifiedVehDimensionlessResponses: [0, 0.5, 1],
  callerVolumePerPressureScale: 10,
  callerVehKernelConventionVerified: true,
} satisfies Input;
export const exampleOutput = {
  vehSuperposedInfluxByStep: [0, 5, 20],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/water-influx-unsteady-state-van-everdingen-hurst",
  title:
    "Petroleum Water Influx Unsteady State Van Everdingen Hurst Calculator",
  description:
    "Superpose actual pressure-step history through independently supplied VanEverdingen–Hurst unit-step kernel/normalization, not invented kernel PDE solution, Schilthuis steadyPI or exponential aquifer shortcut. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "vehSuperposedInfluxByStep",
      label: "Veh superposed influx by step",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPressureStepTimes:
        value.observedPressureStepTimes as readonly number[],
      observedPressureStepDecreases:
        value.observedPressureStepDecreases as readonly number[],
      callerVerifiedVehKernelLagTimes:
        value.callerVerifiedVehKernelLagTimes as readonly number[],
      callerVerifiedVehDimensionlessResponses:
        value.callerVerifiedVehDimensionlessResponses as readonly number[],
      callerVolumePerPressureScale:
        value.callerVolumePerPressureScale as number,
      callerVehKernelConventionVerified:
        value.callerVehKernelConventionVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
