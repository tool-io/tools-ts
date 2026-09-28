import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly payerCost: number;
  readonly patientCost: number;
  readonly productivityCost: number;
  readonly informalCareCost: number;
  readonly includePatient: boolean;
  readonly includeProductivity: boolean;
  readonly includeInformal: boolean;
};
export type Output = {
  readonly includedCost: number;
  readonly excludedCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    payerCost: { type: "number" },
    patientCost: { type: "number" },
    productivityCost: { type: "number" },
    informalCareCost: { type: "number" },
    includePatient: { type: "boolean" },
    includeProductivity: { type: "boolean" },
    includeInformal: { type: "boolean" },
  },
  required: [
    "payerCost",
    "patientCost",
    "productivityCost",
    "informalCareCost",
    "includePatient",
    "includeProductivity",
    "includeInformal",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    includedCost: { type: "number" },
    excludedCost: { type: "number" },
  },
  required: ["includedCost", "excludedCost"],
} as const;
/** Explicit cost-component inclusion flags; no named perspective or jurisdictional evaluation standard is assigned automatically. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    payerCost,
    patientCost,
    productivityCost,
    informalCareCost,
    includePatient,
    includeProductivity,
    includeInformal,
  } = request;
  const compute = (): Output => {
    return {
      includedCost:
        payerCost +
        (includePatient ? patientCost : 0) +
        (includeProductivity ? productivityCost : 0) +
        (includeInformal ? informalCareCost : 0),
      excludedCost:
        (includePatient ? 0 : patientCost) +
        (includeProductivity ? 0 : productivityCost) +
        (includeInformal ? 0 : informalCareCost),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    payerCost: 100,
    patientCost: 20,
    productivityCost: 40,
    informalCareCost: 10,
    includePatient: true,
    includeProductivity: false,
    includeInformal: true,
  },
  output: { includedCost: 130, excludedCost: 40 },
} satisfies ToolExample<Input, Output>;
export const healthCarePerspectiveIncludedCostTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health-economics/health-care-perspective-included-cost-tag",
      title: "Health Care Perspective Included Cost Tag Tool",
      description:
        "Explicit cost-component inclusion flags; no named perspective or jurisdictional evaluation standard is assigned automatically.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          payerCost: { type: "number" },
          patientCost: { type: "number" },
          productivityCost: { type: "number" },
          informalCareCost: { type: "number" },
          includePatient: { type: "boolean" },
          includeProductivity: { type: "boolean" },
          includeInformal: { type: "boolean" },
        },
        required: [
          "payerCost",
          "patientCost",
          "productivityCost",
          "informalCareCost",
          "includePatient",
          "includeProductivity",
          "includeInformal",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          includedCost: { type: "number" },
          excludedCost: { type: "number" },
        },
        required: ["includedCost", "excludedCost"],
      },
      ports: {
        inputs: [
          {
            id: "payerCost",
            label: "Payer Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "patientCost",
            label: "Patient Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "productivityCost",
            label: "Productivity Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "informalCareCost",
            label: "Informal Care Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "includePatient",
            label: "Include Patient",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "includeProductivity",
            label: "Include Productivity",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "includeInformal",
            label: "Include Informal",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "includedCost",
            label: "Included Cost",
            valueType: { type: "number" },
          },
          {
            id: "excludedCost",
            label: "Excluded Cost",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = healthCarePerspectiveIncludedCostTagTool.execute;
export default healthCarePerspectiveIncludedCostTagTool;
