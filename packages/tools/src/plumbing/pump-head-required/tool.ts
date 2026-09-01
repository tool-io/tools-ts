import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
  head,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedRouteElevationChangesM: readonly number[];
  readonly observedRouteLossesM: readonly number[];
  readonly measuredDischargeMinusSuctionPressurePa: number;
  readonly callerWaterDensityKgM3: number;
  readonly callerGravityMetersSecondSquared: number;
  readonly observedDischargeMinusSuctionVelocityHeadM: number;
}>;
export type Output = Readonly<{
  readonly signedRouteStaticLiftM: number;
  readonly totalRouteLossM: number;
  readonly signedRequiredPumpHeadM: number;
}>;
const inputFields = [
  {
    id: "observedRouteElevationChangesM",
    label: "Observed route elevation changes m",
    kind: "numberList",
  },
  {
    id: "observedRouteLossesM",
    label: "Observed route losses m",
    kind: "numberList",
  },
  {
    id: "measuredDischargeMinusSuctionPressurePa",
    label: "Measured discharge minus suction pressure pa",
    kind: "number",
  },
  {
    id: "callerWaterDensityKgM3",
    label: "Caller water density kg m3",
    kind: "number",
  },
  {
    id: "callerGravityMetersSecondSquared",
    label: "Caller gravity meters second squared",
    kind: "number",
  },
  {
    id: "observedDischargeMinusSuctionVelocityHeadM",
    label: "Observed discharge minus suction velocity head m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerWaterDensityKgM3, "callerWaterDensityKgM3");
  positive(
    input.callerGravityMetersSecondSquared,
    "callerGravityMetersSecondSquared",
  );
  input.observedRouteLossesM.forEach((v) =>
    nonnegative(v, "observedRouteLossesM"),
  );
  aligned(
    input.observedRouteElevationChangesM,
    input.observedRouteLossesM,
    "observedRouteElevationChangesM",
  );
  return {
    signedRouteStaticLiftM: sum(input.observedRouteElevationChangesM),
    totalRouteLossM: sum(input.observedRouteLossesM),
    signedRequiredPumpHeadM: sum([
      sum(input.observedRouteElevationChangesM),
      sum(input.observedRouteLossesM),
      head(
        input.measuredDischargeMinusSuctionPressurePa,
        input.callerWaterDensityKgM3,
        input.callerGravityMetersSecondSquared,
      ),
      input.observedDischargeMinusSuctionVelocityHeadM,
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRouteElevationChangesM: [2, -1],
  observedRouteLossesM: [1, 3],
  measuredDischargeMinusSuctionPressurePa: 10000,
  callerWaterDensityKgM3: 1000,
  callerGravityMetersSecondSquared: 10,
  observedDischargeMinusSuctionVelocityHeadM: 0.5,
} satisfies Input;
export const exampleOutput = {
  signedRouteStaticLiftM: 1,
  totalRouteLossM: 4,
  signedRequiredPumpHeadM: 6.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/pump-head-required",
  title: "Plumbing Pump Head Required Calculator",
  description:
    "Reconcile independently observed multi-segment pump-route lift/loss and signed pressure/velocity boundary differences; not existing scalar nonnegative total dynamic head, vendor pump selection or cavitation guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedRouteStaticLiftM",
      label: "Signed route static lift m",
      kind: "number",
    },
    { id: "totalRouteLossM", label: "Total route loss m", kind: "number" },
    {
      id: "signedRequiredPumpHeadM",
      label: "Signed required pump head m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRouteElevationChangesM:
        value.observedRouteElevationChangesM as readonly number[],
      observedRouteLossesM: value.observedRouteLossesM as readonly number[],
      measuredDischargeMinusSuctionPressurePa:
        value.measuredDischargeMinusSuctionPressurePa as number,
      callerWaterDensityKgM3: value.callerWaterDensityKgM3 as number,
      callerGravityMetersSecondSquared:
        value.callerGravityMetersSecondSquared as number,
      observedDischargeMinusSuctionVelocityHeadM:
        value.observedDischargeMinusSuctionVelocityHeadM as number,
    }),
});
export const run = tool.execute;
export default tool;
