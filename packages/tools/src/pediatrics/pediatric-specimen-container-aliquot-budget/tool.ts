import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableVolume: number;
  readonly deadVolume: number;
  readonly aliquots: number;
  readonly aliquotVolume: number;
  readonly reserveVolume: number;
};
export type Output = {
  readonly usableVolume: number;
  readonly requiredVolume: number;
  readonly remainingVolume: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableVolume: { type: "number", minimum: 0 },
    deadVolume: { type: "number", minimum: 0 },
    aliquots: { type: "integer", minimum: 0 },
    aliquotVolume: { type: "number", minimum: 0 },
    reserveVolume: { type: "number", minimum: 0 },
  },
  required: [
    "availableVolume",
    "deadVolume",
    "aliquots",
    "aliquotVolume",
    "reserveVolume",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usableVolume: { type: "number" },
    requiredVolume: { type: "number" },
    remainingVolume: { type: "number" },
    fits: { type: "boolean" },
  },
  required: ["usableVolume", "requiredVolume", "remainingVolume", "fits"],
} as const;
/** Explicit container-volume inventory, not a specimen collection amount or laboratory processing recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    availableVolume,
    deadVolume,
    aliquots,
    aliquotVolume,
    reserveVolume,
  } = request;
  const compute = (): Output => {
    H.domain(
      availableVolume >= 0 &&
        deadVolume >= 0 &&
        deadVolume <= availableVolume &&
        aliquotVolume >= 0 &&
        reserveVolume >= 0,
    );
    H.integer(aliquots, 0);
    return {
      usableVolume: availableVolume - deadVolume,
      requiredVolume: aliquots * aliquotVolume + reserveVolume,
      remainingVolume:
        availableVolume - deadVolume - aliquots * aliquotVolume - reserveVolume,
      fits:
        aliquots * aliquotVolume + reserveVolume <=
        availableVolume - deadVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    availableVolume: 10,
    deadVolume: 1,
    aliquots: 3,
    aliquotVolume: 2,
    reserveVolume: 1,
  },
  output: {
    usableVolume: 9,
    requiredVolume: 7,
    remainingVolume: 2,
    fits: true,
  },
} satisfies ToolExample<Input, Output>;
export const pediatricSpecimenContainerAliquotBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pediatrics/pediatric-specimen-container-aliquot-budget",
      title: "Pediatric Specimen Container Aliquot Budget Tool",
      description:
        "Explicit container-volume inventory, not a specimen collection amount or laboratory processing recommendation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          availableVolume: { type: "number", minimum: 0 },
          deadVolume: { type: "number", minimum: 0 },
          aliquots: { type: "integer", minimum: 0 },
          aliquotVolume: { type: "number", minimum: 0 },
          reserveVolume: { type: "number", minimum: 0 },
        },
        required: [
          "availableVolume",
          "deadVolume",
          "aliquots",
          "aliquotVolume",
          "reserveVolume",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          usableVolume: { type: "number" },
          requiredVolume: { type: "number" },
          remainingVolume: { type: "number" },
          fits: { type: "boolean" },
        },
        required: ["usableVolume", "requiredVolume", "remainingVolume", "fits"],
      },
      ports: {
        inputs: [
          {
            id: "availableVolume",
            label: "Available Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "deadVolume",
            label: "Dead Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "aliquots",
            label: "Aliquots",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "aliquotVolume",
            label: "Aliquot Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reserveVolume",
            label: "Reserve Volume",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "usableVolume",
            label: "Usable Volume",
            valueType: { type: "number" },
          },
          {
            id: "requiredVolume",
            label: "Required Volume",
            valueType: { type: "number" },
          },
          {
            id: "remainingVolume",
            label: "Remaining Volume",
            valueType: { type: "number" },
          },
          { id: "fits", label: "Fits", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = pediatricSpecimenContainerAliquotBudgetTool.execute;
export default pediatricSpecimenContainerAliquotBudgetTool;
