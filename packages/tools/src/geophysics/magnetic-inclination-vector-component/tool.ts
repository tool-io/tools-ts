import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalField: number;
  readonly inclinationRadians: number;
  readonly declinationRadians: number;
};
export type Output = {
  readonly north: number;
  readonly east: number;
  readonly down: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalField: { type: "number", minimum: 0 },
    inclinationRadians: { type: "number" },
    declinationRadians: { type: "number" },
  },
  required: ["totalField", "inclinationRadians", "declinationRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    north: { type: "number" },
    east: { type: "number" },
    down: { type: "number" },
  },
  required: ["north", "east", "down"],
} as const;
/** Magnetic north/east/down components, inclination positive downward and declination clockwise from north, all angles radians. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalField, inclinationRadians, declinationRadians } = request;
  const compute = (): Output => {
    H.domain(
      totalField >= 0 &&
        inclinationRadians >= -Math.PI / 2 &&
        inclinationRadians <= Math.PI / 2,
    );
    return {
      north:
        totalField *
        Math.cos(inclinationRadians) *
        Math.cos(declinationRadians),
      east:
        totalField *
        Math.cos(inclinationRadians) *
        Math.sin(declinationRadians),
      down: totalField * Math.sin(inclinationRadians),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalField: 50000, inclinationRadians: 0, declinationRadians: 0 },
  output: { north: 50000, east: 0, down: 0 },
} satisfies ToolExample<Input, Output>;
export const magneticInclinationVectorComponentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geophysics/magnetic-inclination-vector-component",
    title: "Magnetic Inclination Vector Component Tool",
    description:
      "Magnetic north/east/down components, inclination positive downward and declination clockwise from north, all angles radians.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalField: { type: "number", minimum: 0 },
        inclinationRadians: { type: "number" },
        declinationRadians: { type: "number" },
      },
      required: ["totalField", "inclinationRadians", "declinationRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        north: { type: "number" },
        east: { type: "number" },
        down: { type: "number" },
      },
      required: ["north", "east", "down"],
    },
    ports: {
      inputs: [
        {
          id: "totalField",
          label: "Total Field",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inclinationRadians",
          label: "Inclination Radians",
          required: true,
          valueType: { type: "number", unit: "rad" },
        },
        {
          id: "declinationRadians",
          label: "Declination Radians",
          required: true,
          valueType: { type: "number", unit: "rad" },
        },
      ],
      outputs: [
        { id: "north", label: "North", valueType: { type: "number" } },
        { id: "east", label: "East", valueType: { type: "number" } },
        { id: "down", label: "Down", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = magneticInclinationVectorComponentTool.execute;
export default magneticInclinationVectorComponentTool;
