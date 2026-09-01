import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedSteamDemandKgHour: number;
  readonly observedContinuousBlowdownKgHour: number;
  readonly callerReturnedCondensateFraction: number;
}>;
export type Output = Readonly<{
  readonly requiredGrossBoilerFeedwaterKgHour: number;
  readonly requiredMakeupWaterKgHour: number;
  readonly modeledReturnedCondensateKgHour: number;
}>;
const inputFields = [
  {
    id: "observedSteamDemandKgHour",
    label: "Observed steam demand kg hour",
    kind: "number",
  },
  {
    id: "observedContinuousBlowdownKgHour",
    label: "Observed continuous blowdown kg hour",
    kind: "number",
  },
  {
    id: "callerReturnedCondensateFraction",
    label: "Caller returned condensate fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.observedSteamDemandKgHour, "observedSteamDemandKgHour");
  nonnegative(
    input.observedContinuousBlowdownKgHour,
    "observedContinuousBlowdownKgHour",
  );
  fraction(
    input.callerReturnedCondensateFraction,
    "callerReturnedCondensateFraction",
  );
  const returned =
    input.observedSteamDemandKgHour * input.callerReturnedCondensateFraction;
  return {
    requiredGrossBoilerFeedwaterKgHour:
      input.observedSteamDemandKgHour + input.observedContinuousBlowdownKgHour,
    requiredMakeupWaterKgHour:
      input.observedSteamDemandKgHour -
      returned +
      input.observedContinuousBlowdownKgHour,
    modeledReturnedCondensateKgHour: returned,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSteamDemandKgHour: 100,
  observedContinuousBlowdownKgHour: 5,
  callerReturnedCondensateFraction: 0.6,
} satisfies Input;
export const exampleOutput = {
  requiredGrossBoilerFeedwaterKgHour: 105,
  requiredMakeupWaterKgHour: 45,
  modeledReturnedCondensateKgHour: 60,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/steam-boiler-feedwater-rate",
  title: "Plumbing Steam Boiler Feedwater Rate Calculator",
  description:
    "Reconcile actual boiler steam/blowdown/returned condensate mass ledger, separating gross feedwater and external makeup; no pump volumetric flow or boiler operating instructions.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredGrossBoilerFeedwaterKgHour",
      label: "Required gross boiler feedwater kg hour",
      kind: "number",
    },
    {
      id: "requiredMakeupWaterKgHour",
      label: "Required makeup water kg hour",
      kind: "number",
    },
    {
      id: "modeledReturnedCondensateKgHour",
      label: "Modeled returned condensate kg hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSteamDemandKgHour: value.observedSteamDemandKgHour as number,
      observedContinuousBlowdownKgHour:
        value.observedContinuousBlowdownKgHour as number,
      callerReturnedCondensateFraction:
        value.callerReturnedCondensateFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
