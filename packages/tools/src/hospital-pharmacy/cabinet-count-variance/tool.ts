import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expectedUnits: number;
  readonly countedUnits: number;
  readonly excludedUnits: number;
};
export type Output = {
  readonly adjustedCount: number;
  readonly variance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedUnits: { type: "integer" },
    countedUnits: { type: "integer" },
    excludedUnits: { type: "integer" },
  },
  required: ["expectedUnits", "countedUnits", "excludedUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    adjustedCount: { type: "integer" },
    variance: { type: "integer" },
  },
  required: ["adjustedCount", "variance"],
} as const;
/** Reconcile supplied cabinet stock counts without medicine verification or dispensing decisions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expectedUnits, countedUnits, excludedUnits } = request;
  const compute = (): Output => {
    H.domain(
      [expectedUnits, countedUnits, excludedUnits].every((x) => x >= 0) &&
        excludedUnits <= countedUnits,
    );
    return {
      adjustedCount: countedUnits - excludedUnits,
      variance: Number(
        BigInt(countedUnits) - BigInt(excludedUnits) - BigInt(expectedUnits),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { expectedUnits: 100, countedUnits: 110, excludedUnits: 5 },
  output: { adjustedCount: 105, variance: 5 },
} satisfies ToolExample<Input, Output>;
export const cabinetCountVarianceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospital-pharmacy/cabinet-count-variance",
    title: "Cabinet Count Variance Tool",
    description:
      "Reconcile supplied cabinet stock counts without medicine verification or dispensing decisions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedUnits: { type: "integer" },
        countedUnits: { type: "integer" },
        excludedUnits: { type: "integer" },
      },
      required: ["expectedUnits", "countedUnits", "excludedUnits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        adjustedCount: { type: "integer" },
        variance: { type: "integer" },
      },
      required: ["adjustedCount", "variance"],
    },
    ports: {
      inputs: [
        {
          id: "expectedUnits",
          label: "Expected Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "countedUnits",
          label: "Counted Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludedUnits",
          label: "Excluded Units",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "adjustedCount",
          label: "Adjusted Count",
          valueType: { type: "integer" },
        },
        { id: "variance", label: "Variance", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = cabinetCountVarianceTool.execute;
export default cabinetCountVarianceTool;
