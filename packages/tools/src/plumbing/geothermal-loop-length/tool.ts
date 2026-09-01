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
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerRequiredGroundHeatExchangeWatts: number;
  readonly callerIndependentlyMeasuredSeasonalExchangeWattsMeter: number;
  readonly callerInstalledLoopLengthsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly requiredGroundLoopTotalMeters: number;
  readonly observedInstalledGroundLoopMeters: number;
  readonly signedInstalledLoopLengthMarginM: number;
}>;
const inputFields = [
  {
    id: "callerRequiredGroundHeatExchangeWatts",
    label: "Caller required ground heat exchange watts",
    kind: "number",
  },
  {
    id: "callerIndependentlyMeasuredSeasonalExchangeWattsMeter",
    label: "Caller independently measured seasonal exchange watts meter",
    kind: "number",
  },
  {
    id: "callerInstalledLoopLengthsM",
    label: "Caller installed loop lengths m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerIndependentlyMeasuredSeasonalExchangeWattsMeter,
    "callerIndependentlyMeasuredSeasonalExchangeWattsMeter",
  );
  nonnegative(
    input.callerRequiredGroundHeatExchangeWatts,
    "callerRequiredGroundHeatExchangeWatts",
  );
  input.callerInstalledLoopLengthsM.forEach((v) =>
    nonnegative(v, "callerInstalledLoopLengthsM"),
  );
  if (!input.callerInstalledLoopLengthsM.length)
    simpleError("loops", "Actual installed loop inventory required.");
  const required =
      input.callerRequiredGroundHeatExchangeWatts /
      input.callerIndependentlyMeasuredSeasonalExchangeWattsMeter,
    installed = sum(input.callerInstalledLoopLengthsM);
  return {
    requiredGroundLoopTotalMeters: required,
    observedInstalledGroundLoopMeters: installed,
    signedInstalledLoopLengthMarginM: installed - required,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerRequiredGroundHeatExchangeWatts: 5000,
  callerIndependentlyMeasuredSeasonalExchangeWattsMeter: 25,
  callerInstalledLoopLengthsM: [50, 100],
} satisfies Input;
export const exampleOutput = {
  requiredGroundLoopTotalMeters: 200,
  observedInstalledGroundLoopMeters: 150,
  signedInstalledLoopLengthMarginM: -50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/geothermal-loop-length",
  title: "Plumbing Geothermal Loop Length Calculator",
  description:
    "Budget actual installed geothermal loop inventory against independently established site/season exchange calibration; no W/m default, soil thermal transient, drilling/geology or safe system design.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredGroundLoopTotalMeters",
      label: "Required ground loop total meters",
      kind: "number",
    },
    {
      id: "observedInstalledGroundLoopMeters",
      label: "Observed installed ground loop meters",
      kind: "number",
    },
    {
      id: "signedInstalledLoopLengthMarginM",
      label: "Signed installed loop length margin m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerRequiredGroundHeatExchangeWatts:
        value.callerRequiredGroundHeatExchangeWatts as number,
      callerIndependentlyMeasuredSeasonalExchangeWattsMeter:
        value.callerIndependentlyMeasuredSeasonalExchangeWattsMeter as number,
      callerInstalledLoopLengthsM:
        value.callerInstalledLoopLengthsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
