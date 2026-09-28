import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issued: number;
  readonly consumed: number;
  readonly unused: number;
  readonly damaged: number;
};
export type Output = {
  readonly unaccounted: number;
  readonly unusedFraction: number;
  readonly consumedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issued: { type: "integer", minimum: 1 },
    consumed: { type: "integer", minimum: 0 },
    unused: { type: "integer", minimum: 0 },
    damaged: { type: "integer", minimum: 0 },
  },
  required: ["issued", "consumed", "unused", "damaged"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unaccounted: { type: "integer" },
    unusedFraction: { type: "number" },
    consumedFraction: { type: "number" },
  },
  required: ["unaccounted", "unusedFraction", "consumedFraction"],
} as const;
/** Calculate gmp reconciliation unused issued unit share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issued, consumed, unused, damaged } = request;
  const compute = (): Output => {
    H.integer(issued, 1);
    H.integer(consumed, 0);
    H.integer(unused, 0);
    H.integer(damaged, 0);
    return {
      unaccounted: issued - consumed - unused - damaged,
      unusedFraction: unused / issued,
      consumedFraction: consumed / issued,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { issued: 100, consumed: 70, unused: 20, damaged: 5 },
  output: { unaccounted: 5, unusedFraction: 0.2, consumedFraction: 0.7 },
} satisfies ToolExample<Input, Output>;
export const gmpReconciliationUnusedIssuedUnitShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gmp/gmp-reconciliation-unused-issued-unit-share",
      title: "GMP Reconciliation Unused Issued Unit Share Tool",
      description:
        "Calculate gmp reconciliation unused issued unit share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          issued: { type: "integer", minimum: 1 },
          consumed: { type: "integer", minimum: 0 },
          unused: { type: "integer", minimum: 0 },
          damaged: { type: "integer", minimum: 0 },
        },
        required: ["issued", "consumed", "unused", "damaged"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unaccounted: { type: "integer" },
          unusedFraction: { type: "number" },
          consumedFraction: { type: "number" },
        },
        required: ["unaccounted", "unusedFraction", "consumedFraction"],
      },
      ports: {
        inputs: [
          {
            id: "issued",
            label: "Issued",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "consumed",
            label: "Consumed",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "unused",
            label: "Unused",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "damaged",
            label: "Damaged",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "unaccounted",
            label: "Unaccounted",
            valueType: { type: "integer" },
          },
          {
            id: "unusedFraction",
            label: "Unused Fraction",
            valueType: { type: "number" },
          },
          {
            id: "consumedFraction",
            label: "Consumed Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = gmpReconciliationUnusedIssuedUnitShareTool.execute;
export default gmpReconciliationUnusedIssuedUnitShareTool;
