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
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly lampElectricalWatts: number;
  readonly photonEfficacyMicromolesPerJoule: number;
  readonly canopyDeliveryFraction: number;
  readonly canopyAreaM2: number;
  readonly dailyOnHours: number;
  readonly electricityCostPerKwh: number;
  readonly dailyAllocatedFixtureCost: number;
}>;
export type Output = Readonly<{
  readonly deliveredDailyLightIntegral: number;
  readonly dailyElectricalKwh: number;
  readonly dailyTotalLightingCost: number;
  readonly costPerDeliveredMole: number;
  readonly costPerDliUnit: number;
}>;
const inputFields = [
  { id: "lampElectricalWatts", label: "Lamp electrical watts", kind: "number" },
  {
    id: "photonEfficacyMicromolesPerJoule",
    label: "Photon efficacy micromoles per joule",
    kind: "number",
  },
  {
    id: "canopyDeliveryFraction",
    label: "Canopy delivery fraction",
    kind: "number",
  },
  { id: "canopyAreaM2", label: "Canopy area m2", kind: "number" },
  { id: "dailyOnHours", label: "Daily on hours", kind: "number" },
  {
    id: "electricityCostPerKwh",
    label: "Electricity cost per kwh",
    kind: "number",
  },
  {
    id: "dailyAllocatedFixtureCost",
    label: "Daily allocated fixture cost",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.lampElectricalWatts, "lampElectricalWatts");
  positive(
    input.photonEfficacyMicromolesPerJoule,
    "photonEfficacyMicromolesPerJoule",
  );
  positive(input.canopyDeliveryFraction, "canopyDeliveryFraction");
  positive(input.canopyAreaM2, "canopyAreaM2");
  positive(input.dailyOnHours, "dailyOnHours");
  nonnegative(input.electricityCostPerKwh, "electricityCostPerKwh");
  nonnegative(input.dailyAllocatedFixtureCost, "dailyAllocatedFixtureCost");
  fraction(input.canopyDeliveryFraction, "canopyDeliveryFraction");
  if (input.dailyOnHours > 24)
    simpleError("dailyOnHours", "At most 24 daily operating hours required.");
  const moles =
      input.lampElectricalWatts *
      input.photonEfficacyMicromolesPerJoule *
      input.canopyDeliveryFraction *
      input.dailyOnHours *
      0.0036,
    deliveredDailyLightIntegral = moles / input.canopyAreaM2,
    dailyElectricalKwh =
      (input.lampElectricalWatts * input.dailyOnHours) / 1000,
    dailyTotalLightingCost =
      dailyElectricalKwh * input.electricityCostPerKwh +
      input.dailyAllocatedFixtureCost;
  return {
    deliveredDailyLightIntegral,
    dailyElectricalKwh,
    dailyTotalLightingCost,
    costPerDeliveredMole: dailyTotalLightingCost / moles,
    costPerDliUnit: dailyTotalLightingCost / deliveredDailyLightIntegral,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  lampElectricalWatts: 100,
  photonEfficacyMicromolesPerJoule: 2,
  canopyDeliveryFraction: 0.5,
  canopyAreaM2: 2,
  dailyOnHours: 10,
  electricityCostPerKwh: 0.2,
  dailyAllocatedFixtureCost: 0.1,
} satisfies Input;
export const exampleOutput = {
  deliveredDailyLightIntegral: 1.8,
  dailyElectricalKwh: 1,
  dailyTotalLightingCost: 0.3,
  costPerDeliveredMole: 0.08333333333333333,
  costPerDliUnit: 0.16666666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/led-cost-per-dli-delivered",
  title: "LED Cost Per DLI Delivered",
  description:
    "Compare electrical and allocated fixture costs per delivered canopy photon mole and per DLI unit using supplied efficacy/delivery; canopy area distinguishes total photons from areal dose.",
  inputs: inputFields,
  outputs: [
    {
      id: "deliveredDailyLightIntegral",
      label: "Delivered daily light integral",
      kind: "number",
    },
    { id: "dailyElectricalKwh", label: "Daily electrical kwh", kind: "number" },
    {
      id: "dailyTotalLightingCost",
      label: "Daily total lighting cost",
      kind: "number",
    },
    {
      id: "costPerDeliveredMole",
      label: "Cost per delivered mole",
      kind: "number",
    },
    { id: "costPerDliUnit", label: "Cost per dli unit", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      lampElectricalWatts: value.lampElectricalWatts as number,
      photonEfficacyMicromolesPerJoule:
        value.photonEfficacyMicromolesPerJoule as number,
      canopyDeliveryFraction: value.canopyDeliveryFraction as number,
      canopyAreaM2: value.canopyAreaM2 as number,
      dailyOnHours: value.dailyOnHours as number,
      electricityCostPerKwh: value.electricityCostPerKwh as number,
      dailyAllocatedFixtureCost: value.dailyAllocatedFixtureCost as number,
    }),
});
export const run = tool.execute;
export default tool;
