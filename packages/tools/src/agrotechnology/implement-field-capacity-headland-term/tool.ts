import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly widthMeters: number;
  readonly speedKmPerHour: number;
  readonly fieldEfficiency: number;
  readonly headlandFraction: number;
};
export type Output = {
  readonly theoreticalHaPerHour: number;
  readonly effectiveHaPerHour: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    widthMeters: { type: "number", minimum: 0 },
    speedKmPerHour: { type: "number", minimum: 0 },
    fieldEfficiency: { type: "number", minimum: 0, maximum: 1 },
    headlandFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "widthMeters",
    "speedKmPerHour",
    "fieldEfficiency",
    "headlandFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    theoreticalHaPerHour: { type: "number" },
    effectiveHaPerHour: { type: "number" },
  },
  required: ["theoreticalHaPerHour", "effectiveHaPerHour"],
} as const;
/** Calculate implement field capacity headland term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { widthMeters, speedKmPerHour, fieldEfficiency, headlandFraction } =
    request;
  const compute = (): Output => {
    H.domain(widthMeters >= 0 && speedKmPerHour >= 0);
    H.probability(fieldEfficiency);
    H.probability(headlandFraction);
    return {
      theoreticalHaPerHour: (widthMeters * speedKmPerHour) / 10,
      effectiveHaPerHour:
        (widthMeters *
          speedKmPerHour *
          fieldEfficiency *
          (1 - headlandFraction)) /
        10,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    widthMeters: 5,
    speedKmPerHour: 8,
    fieldEfficiency: 0.8,
    headlandFraction: 0.1,
  },
  output: { theoreticalHaPerHour: 4, effectiveHaPerHour: 2.88 },
} satisfies ToolExample<Input, Output>;
export const implementFieldCapacityHeadlandTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/implement-field-capacity-headland-term",
    title: "Implement Field Capacity Headland Term Tool",
    description:
      "Calculate implement field capacity headland term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        widthMeters: { type: "number", minimum: 0 },
        speedKmPerHour: { type: "number", minimum: 0 },
        fieldEfficiency: { type: "number", minimum: 0, maximum: 1 },
        headlandFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "widthMeters",
        "speedKmPerHour",
        "fieldEfficiency",
        "headlandFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        theoreticalHaPerHour: { type: "number" },
        effectiveHaPerHour: { type: "number" },
      },
      required: ["theoreticalHaPerHour", "effectiveHaPerHour"],
    },
    ports: {
      inputs: [
        {
          id: "widthMeters",
          label: "Width Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "speedKmPerHour",
          label: "Speed Km Per Hour",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fieldEfficiency",
          label: "Field Efficiency",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "headlandFraction",
          label: "Headland Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "theoreticalHaPerHour",
          label: "Theoretical Ha Per Hour",
          valueType: { type: "number" },
        },
        {
          id: "effectiveHaPerHour",
          label: "Effective Ha Per Hour",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = implementFieldCapacityHeadlandTermTool.execute;
export default implementFieldCapacityHeadlandTermTool;
