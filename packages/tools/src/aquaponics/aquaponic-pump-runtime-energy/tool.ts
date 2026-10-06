import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pumpPowerWatts: number;
  readonly runtimeHours: number;
};
export type Output = { readonly energyKilowattHours: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pumpPowerWatts: { type: "number", minimum: 0 },
    runtimeHours: { type: "number", minimum: 0 },
  },
  required: ["pumpPowerWatts", "runtimeHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { energyKilowattHours: { type: "number" } },
  required: ["energyKilowattHours"],
} as const;
/** Calculate explicit constant-power pump energy from watts and runtime hours without sizing equipment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pumpPowerWatts, runtimeHours } = request;
  const compute = (): Output => {
    H.domain(pumpPowerWatts >= 0 && runtimeHours >= 0, "pumpPowerWatts");
    return { energyKilowattHours: (pumpPowerWatts / 1000) * runtimeHours };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pumpPowerWatts: 100, runtimeHours: 12 },
  output: { energyKilowattHours: 1.2000000000000002 },
} satisfies ToolExample<Input, Output>;
export const aquaponicPumpRuntimeEnergyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["aquaponics", "agriculture"],
      keywords: ["aquaponics", "agriculture"],
    },
    id: "aquaponics/aquaponic-pump-runtime-energy",
    title: "Aquaponic Pump Runtime Energy",
    description:
      "Calculate explicit constant-power pump energy from watts and runtime hours without sizing equipment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pumpPowerWatts: { type: "number", minimum: 0 },
        runtimeHours: { type: "number", minimum: 0 },
      },
      required: ["pumpPowerWatts", "runtimeHours"],
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
          id: "pumpPowerWatts",
          label: "Pump Power Watts",
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
export const run = aquaponicPumpRuntimeEnergyTool.execute;
export default aquaponicPumpRuntimeEnergyTool;
