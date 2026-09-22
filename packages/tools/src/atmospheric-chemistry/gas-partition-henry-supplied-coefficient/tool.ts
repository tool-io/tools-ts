import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly partialPressure: number;
  readonly henryMolarPerVolumePressure: number;
  readonly waterVolume: number;
};
export type Output = {
  readonly dissolvedConcentration: number;
  readonly dissolvedAmount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    partialPressure: { type: "number", minimum: 0 },
    henryMolarPerVolumePressure: { type: "number", minimum: 0 },
    waterVolume: { type: "number", minimum: 0 },
  },
  required: ["partialPressure", "henryMolarPerVolumePressure", "waterVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dissolvedConcentration: { type: "number" },
    dissolvedAmount: { type: "number" },
  },
  required: ["dissolvedConcentration", "dissolvedAmount"],
} as const;
/** Henry convention C = H*p; caller supplies a coefficient in concentration per pressure, not its reciprocal. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { partialPressure, henryMolarPerVolumePressure, waterVolume } = request;
  const compute = (): Output => {
    H.domain(
      partialPressure >= 0 &&
        henryMolarPerVolumePressure >= 0 &&
        waterVolume >= 0,
    );
    return {
      dissolvedConcentration: partialPressure * henryMolarPerVolumePressure,
      dissolvedAmount:
        partialPressure * henryMolarPerVolumePressure * waterVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { partialPressure: 2, henryMolarPerVolumePressure: 3, waterVolume: 4 },
  output: { dissolvedConcentration: 6, dissolvedAmount: 24 },
} satisfies ToolExample<Input, Output>;
export const gasPartitionHenrySuppliedCoefficientTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-chemistry/gas-partition-henry-supplied-coefficient",
      title: "Gas Partition Henry Supplied Coefficient Tool",
      description:
        "Henry convention C = H*p; caller supplies a coefficient in concentration per pressure, not its reciprocal.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          partialPressure: { type: "number", minimum: 0 },
          henryMolarPerVolumePressure: { type: "number", minimum: 0 },
          waterVolume: { type: "number", minimum: 0 },
        },
        required: [
          "partialPressure",
          "henryMolarPerVolumePressure",
          "waterVolume",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dissolvedConcentration: { type: "number" },
          dissolvedAmount: { type: "number" },
        },
        required: ["dissolvedConcentration", "dissolvedAmount"],
      },
      ports: {
        inputs: [
          {
            id: "partialPressure",
            label: "Partial Pressure",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "henryMolarPerVolumePressure",
            label: "Henry Molar Per Volume Pressure",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "waterVolume",
            label: "Water Volume",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "dissolvedConcentration",
            label: "Dissolved Concentration",
            valueType: { type: "number" },
          },
          {
            id: "dissolvedAmount",
            label: "Dissolved Amount",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = gasPartitionHenrySuppliedCoefficientTool.execute;
export default gasPartitionHenrySuppliedCoefficientTool;
