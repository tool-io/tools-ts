import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hemoglobin: number;
  readonly saturation: number;
  readonly oxygenCapacityFactor: number;
  readonly dissolvedOxygen: number;
};
export type Output = {
  readonly boundOxygen: number;
  readonly totalContent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hemoglobin: { type: "number", minimum: 0 },
    saturation: { type: "number", minimum: 0, maximum: 1 },
    oxygenCapacityFactor: { type: "number", minimum: 0 },
    dissolvedOxygen: { type: "number", minimum: 0 },
  },
  required: [
    "hemoglobin",
    "saturation",
    "oxygenCapacityFactor",
    "dissolvedOxygen",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    boundOxygen: { type: "number" },
    totalContent: { type: "number" },
  },
  required: ["boundOxygen", "totalContent"],
} as const;
/** Supplied hemoglobin oxygen-capacity product plus independently supplied dissolved content in matching units; no blood-gas inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hemoglobin, saturation, oxygenCapacityFactor, dissolvedOxygen } =
    request;
  const compute = (): Output => {
    H.domain(
      hemoglobin >= 0 && oxygenCapacityFactor >= 0 && dissolvedOxygen >= 0,
    );
    H.probability(saturation);
    return {
      boundOxygen: hemoglobin * saturation * oxygenCapacityFactor,
      totalContent:
        hemoglobin * saturation * oxygenCapacityFactor + dissolvedOxygen,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    hemoglobin: 150,
    saturation: 0.98,
    oxygenCapacityFactor: 1.34,
    dissolvedOxygen: 3,
  },
  output: { boundOxygen: 196.98000000000002, totalContent: 199.98000000000002 },
} satisfies ToolExample<Input, Output>;
export const oxygenContentHemoglobinSuppliedFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "physiology/oxygen-content-hemoglobin-supplied-factor",
      title: "Oxygen Content Hemoglobin Supplied Factor Tool",
      description:
        "Supplied hemoglobin oxygen-capacity product plus independently supplied dissolved content in matching units; no blood-gas inference.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          hemoglobin: { type: "number", minimum: 0 },
          saturation: { type: "number", minimum: 0, maximum: 1 },
          oxygenCapacityFactor: { type: "number", minimum: 0 },
          dissolvedOxygen: { type: "number", minimum: 0 },
        },
        required: [
          "hemoglobin",
          "saturation",
          "oxygenCapacityFactor",
          "dissolvedOxygen",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          boundOxygen: { type: "number" },
          totalContent: { type: "number" },
        },
        required: ["boundOxygen", "totalContent"],
      },
      ports: {
        inputs: [
          {
            id: "hemoglobin",
            label: "Hemoglobin",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "saturation",
            label: "Saturation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "oxygenCapacityFactor",
            label: "Oxygen Capacity Factor",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "dissolvedOxygen",
            label: "Dissolved Oxygen",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "boundOxygen",
            label: "Bound Oxygen",
            valueType: { type: "number" },
          },
          {
            id: "totalContent",
            label: "Total Content",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = oxygenContentHemoglobinSuppliedFactorTool.execute;
export default oxygenContentHemoglobinSuppliedFactorTool;
