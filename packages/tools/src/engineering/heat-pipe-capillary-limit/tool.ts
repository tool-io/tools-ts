import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly surfaceTensionNM: number;
  readonly wettingContactCosine: number;
  readonly wickEffectivePoreRadiusM: number;
  readonly callerGravityPressureLossPa: number;
  readonly callerFlowPressureLossPerWattPaW: number;
}>;
export type Output = Readonly<{
  readonly capillaryPressureBudgetPa: number;
  readonly capillaryLimitModeledWatts: number;
}>;
const inputFields = [
  { id: "surfaceTensionNM", label: "Surface tension n m", kind: "number" },
  {
    id: "wettingContactCosine",
    label: "Wetting contact cosine",
    kind: "number",
  },
  {
    id: "wickEffectivePoreRadiusM",
    label: "Wick effective pore radius m",
    kind: "number",
  },
  {
    id: "callerGravityPressureLossPa",
    label: "Caller gravity pressure loss pa",
    kind: "number",
  },
  {
    id: "callerFlowPressureLossPerWattPaW",
    label: "Caller flow pressure loss per watt pa w",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.surfaceTensionNM, "surfaceTensionNM");
  positive(input.wickEffectivePoreRadiusM, "wickEffectivePoreRadiusM");
  positive(
    input.callerFlowPressureLossPerWattPaW,
    "callerFlowPressureLossPerWattPaW",
  );
  nonnegative(input.callerGravityPressureLossPa, "callerGravityPressureLossPa");
  fraction(input.wettingContactCosine, "wettingContactCosine");
  const budget =
    (2 * input.surfaceTensionNM * input.wettingContactCosine) /
      input.wickEffectivePoreRadiusM -
    input.callerGravityPressureLossPa;
  return {
    capillaryPressureBudgetPa: budget,
    capillaryLimitModeledWatts:
      Math.max(0, budget) / input.callerFlowPressureLossPerWattPaW,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  surfaceTensionNM: 1,
  wettingContactCosine: 1,
  wickEffectivePoreRadiusM: 0.1,
  callerGravityPressureLossPa: 2,
  callerFlowPressureLossPerWattPaW: 3,
} satisfies Input;
export const exampleOutput = {
  capillaryPressureBudgetPa: 18,
  capillaryLimitModeledWatts: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/heat-pipe-capillary-limit",
  title: "Heat Pipe Capillary Limit Calculator",
  description:
    "Heat pipe capillary2γcosθ/r minus independent adverse gravity pressure, linear calibrated flow-loss per heat load; negative pressure budget explicit. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "capillaryPressureBudgetPa",
      label: "Capillary pressure budget pa",
      kind: "number",
    },
    {
      id: "capillaryLimitModeledWatts",
      label: "Capillary limit modeled watts",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      surfaceTensionNM: value.surfaceTensionNM as number,
      wettingContactCosine: value.wettingContactCosine as number,
      wickEffectivePoreRadiusM: value.wickEffectivePoreRadiusM as number,
      callerGravityPressureLossPa: value.callerGravityPressureLossPa as number,
      callerFlowPressureLossPerWattPaW:
        value.callerFlowPressureLossPerWattPaW as number,
    }),
});
export const run = tool.execute;
export default tool;
