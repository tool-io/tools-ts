import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly powerWatts: number;
  readonly runtimeHours: number;
};
export type Output = { readonly energyKilowattHours: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    powerWatts: { type: "number", minimum: 0 },
    runtimeHours: { type: "number", minimum: 0 },
  },
  required: ["powerWatts", "runtimeHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { energyKilowattHours: { type: "number" } },
  required: ["energyKilowattHours"],
} as const;
/** Calculate constant-power lighting energy from explicit watts and runtime hours without estimating crop response. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { powerWatts, runtimeHours } = request;
  const compute = (): Output => {
    H.domain(powerWatts >= 0 && runtimeHours >= 0, "powerWatts");
    return { energyKilowattHours: (powerWatts / 1000) * runtimeHours };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { powerWatts: 600, runtimeHours: 16 },
  output: { energyKilowattHours: 9.6 },
} satisfies ToolExample<Input, Output>;
export const verticalFarmLightingHourEnergyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["vertical-farming", "vertical farming", "agriculture"],
      keywords: ["vertical farming", "agriculture"],
    },
    id: "vertical-farming/vertical-farm-lighting-hour-energy",
    title: "Vertical Farm Lighting Hour Energy",
    description:
      "Calculate constant-power lighting energy from explicit watts and runtime hours without estimating crop response.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        powerWatts: { type: "number", minimum: 0 },
        runtimeHours: { type: "number", minimum: 0 },
      },
      required: ["powerWatts", "runtimeHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { energyKilowattHours: { type: "number" } },
      required: ["energyKilowattHours"],
    },
    ports: {
      inputs: [
        {
          id: "powerWatts",
          label: "Power Watts",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "runtimeHours",
          label: "Runtime Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "energyKilowattHours",
          label: "Energy Kilowatt Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = verticalFarmLightingHourEnergyTool.execute;
export default verticalFarmLightingHourEnergyTool;
