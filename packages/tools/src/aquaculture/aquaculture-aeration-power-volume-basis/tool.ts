import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inputPower: number;
  readonly volume: number;
  readonly operatingHours: number;
};
export type Output = {
  readonly powerPerVolume: number;
  readonly energy: number;
  readonly energyPerVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputPower: { type: "number", minimum: 0 },
    volume: { type: "number", exclusiveMinimum: 0 },
    operatingHours: { type: "number", minimum: 0 },
  },
  required: ["inputPower", "volume", "operatingHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    powerPerVolume: { type: "number" },
    energy: { type: "number" },
    energyPerVolume: { type: "number" },
  },
  required: ["powerPerVolume", "energy", "energyPerVolume"],
} as const;
/** Energy uses the caller-consistent power/hour unit basis and does not estimate oxygen transfer. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inputPower, volume, operatingHours } = request;
  const compute = (): Output => {
    H.domain(inputPower >= 0 && operatingHours >= 0);
    H.positive(volume);
    return {
      powerPerVolume: inputPower / volume,
      energy: inputPower * operatingHours,
      energyPerVolume: (inputPower * operatingHours) / volume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inputPower: 2, volume: 100, operatingHours: 8 },
  output: { powerPerVolume: 0.02, energy: 16, energyPerVolume: 0.16 },
} satisfies ToolExample<Input, Output>;
export const aquacultureAerationPowerVolumeBasisTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "aquaculture/aquaculture-aeration-power-volume-basis",
      title: "Aquaculture Aeration Power Volume Basis Tool",
      description:
        "Energy uses the caller-consistent power/hour unit basis and does not estimate oxygen transfer.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inputPower: { type: "number", minimum: 0 },
          volume: { type: "number", exclusiveMinimum: 0 },
          operatingHours: { type: "number", minimum: 0 },
        },
        required: ["inputPower", "volume", "operatingHours"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          powerPerVolume: { type: "number" },
          energy: { type: "number" },
          energyPerVolume: { type: "number" },
        },
        required: ["powerPerVolume", "energy", "energyPerVolume"],
      },
      ports: {
        inputs: [
          {
            id: "inputPower",
            label: "Input Power",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "volume",
            label: "Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "operatingHours",
            label: "Operating Hours",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "powerPerVolume",
            label: "Power Per Volume",
            valueType: { type: "number" },
          },
          { id: "energy", label: "Energy", valueType: { type: "number" } },
          {
            id: "energyPerVolume",
            label: "Energy Per Volume",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = aquacultureAerationPowerVolumeBasisTool.execute;
export default aquacultureAerationPowerVolumeBasisTool;
