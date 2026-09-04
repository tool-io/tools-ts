import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedConflictingFlowVehiclesSecond: number;
  readonly callerMatchedCriticalGapSeconds: number;
  readonly callerMatchedFollowUpSeconds: number;
}>;
export type Output = Readonly<{
  readonly gapAcceptanceRoundaboutCapacityVehiclesHour: number;
}>;
const inputFields = [
  {
    id: "observedConflictingFlowVehiclesSecond",
    label: "Observed conflicting flow vehicles second",
    kind: "number",
  },
  {
    id: "callerMatchedCriticalGapSeconds",
    label: "Caller matched critical gap seconds",
    kind: "number",
  },
  {
    id: "callerMatchedFollowUpSeconds",
    label: "Caller matched follow up seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerMatchedCriticalGapSeconds,
    "callerMatchedCriticalGapSeconds",
  );
  positive(input.callerMatchedFollowUpSeconds, "callerMatchedFollowUpSeconds");
  nonnegative(
    input.observedConflictingFlowVehiclesSecond,
    "observedConflictingFlowVehiclesSecond",
  );
  return {
    gapAcceptanceRoundaboutCapacityVehiclesHour:
      input.observedConflictingFlowVehiclesSecond === 0
        ? 3600 / input.callerMatchedFollowUpSeconds
        : (3600 *
            input.observedConflictingFlowVehiclesSecond *
            Math.exp(
              -input.observedConflictingFlowVehiclesSecond *
                input.callerMatchedCriticalGapSeconds,
            )) /
          -Math.expm1(
            -input.observedConflictingFlowVehiclesSecond *
              input.callerMatchedFollowUpSeconds,
          ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedConflictingFlowVehiclesSecond: 0.1,
  callerMatchedCriticalGapSeconds: 5,
  callerMatchedFollowUpSeconds: 2,
} satisfies Input;
export const exampleOutput = {
  gapAcceptanceRoundaboutCapacityVehiclesHour: 1204.5674663749357,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/roundabout-capacity",
  title: "Roundabout Capacity Calculator",
  description:
    "Poisson independent conflicting-arrival gap-acceptance entry capacity with caller calibrated critical/follow-up gaps, exact zero-flow limit; not HCM defaults or saturation guarantee. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "gapAcceptanceRoundaboutCapacityVehiclesHour",
      label: "Gap acceptance roundabout capacity vehicles hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedConflictingFlowVehiclesSecond:
        value.observedConflictingFlowVehiclesSecond as number,
      callerMatchedCriticalGapSeconds:
        value.callerMatchedCriticalGapSeconds as number,
      callerMatchedFollowUpSeconds:
        value.callerMatchedFollowUpSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
