import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly voltage: number;
  readonly current: number;
  readonly geometricFactor: number;
};
export type Output = {
  readonly resistance: number;
  readonly apparentResistivity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voltage: { type: "number" },
    current: { type: "number" },
    geometricFactor: { type: "number" },
  },
  required: ["voltage", "current", "geometricFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resistance: { type: "number" },
    apparentResistivity: { type: "number" },
  },
  required: ["resistance", "apparentResistivity"],
} as const;
/** Four-electrode apparent resistivity using a caller-derived signed array geometry factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { voltage, current, geometricFactor } = request;
  const compute = (): Output => {
    H.domain(current !== 0 && geometricFactor !== 0);
    return {
      resistance: voltage / current,
      apparentResistivity: (geometricFactor * voltage) / current,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { voltage: 0.2, current: 0.01, geometricFactor: 10 },
  output: { resistance: 20, apparentResistivity: 200 },
} satisfies ToolExample<Input, Output>;
export const electricalResistivityArrayGeometricFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geophysics/electrical-resistivity-array-geometric-factor",
      title: "Electrical Resistivity Array Geometric Factor Tool",
      description:
        "Four-electrode apparent resistivity using a caller-derived signed array geometry factor.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          voltage: { type: "number" },
          current: { type: "number" },
          geometricFactor: { type: "number" },
        },
        required: ["voltage", "current", "geometricFactor"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          resistance: { type: "number" },
          apparentResistivity: { type: "number" },
        },
        required: ["resistance", "apparentResistivity"],
      },
      ports: {
        inputs: [
          {
            id: "voltage",
            label: "Voltage",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "current",
            label: "Current",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "geometricFactor",
            label: "Geometric Factor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "resistance",
            label: "Resistance",
            valueType: { type: "number" },
          },
          {
            id: "apparentResistivity",
            label: "Apparent Resistivity",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = electricalResistivityArrayGeometricFactorTool.execute;
export default electricalResistivityArrayGeometricFactorTool;
