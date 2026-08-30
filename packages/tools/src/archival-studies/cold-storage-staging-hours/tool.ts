import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly initialColdObjectTemperatureC: number;
  readonly stagingAmbientTemperatureC: number;
  readonly measuredAmbientDewPointC: number;
  readonly callerMinimumDewpointMarginC: number;
  readonly calibratedThermalTimeConstantHours: number;
}>;
export type Output = Readonly<{
  readonly targetObjectSurfaceTemperatureC: number;
  readonly modelThresholdReachable: boolean;
  readonly minimumLumpedModelStagingHours: number;
}>;
const inputFields = [
  {
    id: "initialColdObjectTemperatureC",
    label: "Initial cold object temperature c",
    kind: "number",
  },
  {
    id: "stagingAmbientTemperatureC",
    label: "Staging ambient temperature c",
    kind: "number",
  },
  {
    id: "measuredAmbientDewPointC",
    label: "Measured ambient dew point c",
    kind: "number",
  },
  {
    id: "callerMinimumDewpointMarginC",
    label: "Caller minimum dewpoint margin c",
    kind: "number",
  },
  {
    id: "calibratedThermalTimeConstantHours",
    label: "Calibrated thermal time constant hours",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.calibratedThermalTimeConstantHours,
    "calibratedThermalTimeConstantHours",
  );
  nonnegative(
    input.callerMinimumDewpointMarginC,
    "callerMinimumDewpointMarginC",
  );
  if (input.measuredAmbientDewPointC > input.stagingAmbientTemperatureC)
    simpleError("dewpoint", "Observed dewpoint cannot exceed staging ambient.");
  const goal =
    input.measuredAmbientDewPointC + input.callerMinimumDewpointMarginC;
  if (input.initialColdObjectTemperatureC >= goal)
    return {
      targetObjectSurfaceTemperatureC: goal,
      modelThresholdReachable: true,
      minimumLumpedModelStagingHours: 0,
    };
  if (
    goal >= input.stagingAmbientTemperatureC ||
    input.initialColdObjectTemperatureC >= input.stagingAmbientTemperatureC
  )
    return {
      targetObjectSurfaceTemperatureC: goal,
      modelThresholdReachable: false,
      minimumLumpedModelStagingHours: 0,
    };
  const hours =
    input.calibratedThermalTimeConstantHours *
    (Math.log(
      input.stagingAmbientTemperatureC - input.initialColdObjectTemperatureC,
    ) -
      Math.log(input.stagingAmbientTemperatureC - goal));
  return {
    targetObjectSurfaceTemperatureC: goal,
    modelThresholdReachable: true,
    minimumLumpedModelStagingHours: hours,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialColdObjectTemperatureC: 0,
  stagingAmbientTemperatureC: 20,
  measuredAmbientDewPointC: 10,
  callerMinimumDewpointMarginC: 2,
  calibratedThermalTimeConstantHours: 2,
} satisfies Input;
export const exampleOutput = {
  targetObjectSurfaceTemperatureC: 12,
  modelThresholdReachable: true,
  minimumLumpedModelStagingHours: 1.8325814637483102,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/cold-storage-staging-hours",
  title: "Cold Storage Acclimatization Staging Hours Calculator",
  description:
    "Invert caller first-order warming calibration to independently observed dewpoint-margin threshold; unreachable threshold is explicit and zero hours unused when false, not safe opening/acclimatization guidance.",
  inputs: inputFields,
  outputs: [
    {
      id: "targetObjectSurfaceTemperatureC",
      label: "Target object surface temperature c",
      kind: "number",
    },
    {
      id: "modelThresholdReachable",
      label: "Model threshold reachable",
      kind: "boolean",
    },
    {
      id: "minimumLumpedModelStagingHours",
      label: "Minimum lumped model staging hours",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialColdObjectTemperatureC:
        value.initialColdObjectTemperatureC as number,
      stagingAmbientTemperatureC: value.stagingAmbientTemperatureC as number,
      measuredAmbientDewPointC: value.measuredAmbientDewPointC as number,
      callerMinimumDewpointMarginC:
        value.callerMinimumDewpointMarginC as number,
      calibratedThermalTimeConstantHours:
        value.calibratedThermalTimeConstantHours as number,
    }),
});
export const run = tool.execute;
export default tool;
