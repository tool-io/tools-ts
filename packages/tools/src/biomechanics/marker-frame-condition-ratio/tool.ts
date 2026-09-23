import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly singularValues: readonly number[];
  readonly suppliedMaximumCondition: number;
};
export type Output = {
  readonly conditionNumber: number;
  readonly minimumSingularValue: number;
  readonly exceedsSuppliedMaximum: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    singularValues: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    suppliedMaximumCondition: { type: "number", minimum: 1 },
  },
  required: ["singularValues", "suppliedMaximumCondition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conditionNumber: { type: "number" },
    minimumSingularValue: { type: "number" },
    exceedsSuppliedMaximum: { type: "boolean" },
  },
  required: [
    "conditionNumber",
    "minimumSingularValue",
    "exceedsSuppliedMaximum",
  ],
} as const;
/** Inspect a supplied 3D frame singular-value condition ratio; no matrix factorization or biomechanical validity judgment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { singularValues, suppliedMaximumCondition } = request;
  const compute = (): Output => {
    H.domain(
      singularValues.length === 3 && singularValues.every((x) => x >= 0),
    );
    H.domain(suppliedMaximumCondition >= 1);
    return (() => {
      const minimumSingularValue = Math.min(...singularValues);
      H.positive(minimumSingularValue);
      const conditionNumber =
        Math.max(...singularValues) / minimumSingularValue;
      return {
        conditionNumber,
        minimumSingularValue,
        exceedsSuppliedMaximum: conditionNumber > suppliedMaximumCondition,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { singularValues: [4, 2, 1], suppliedMaximumCondition: 3 },
  output: {
    conditionNumber: 4,
    minimumSingularValue: 1,
    exceedsSuppliedMaximum: true,
  },
} satisfies ToolExample<Input, Output>;
export const markerFrameConditionRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomechanics/marker-frame-condition-ratio",
    title: "Marker Frame Condition Ratio Tool",
    description:
      "Inspect a supplied 3D frame singular-value condition ratio; no matrix factorization or biomechanical validity judgment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        singularValues: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        suppliedMaximumCondition: { type: "number", minimum: 1 },
      },
      required: ["singularValues", "suppliedMaximumCondition"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conditionNumber: { type: "number" },
        minimumSingularValue: { type: "number" },
        exceedsSuppliedMaximum: { type: "boolean" },
      },
      required: [
        "conditionNumber",
        "minimumSingularValue",
        "exceedsSuppliedMaximum",
      ],
    },
    ports: {
      inputs: [
        {
          id: "singularValues",
          label: "Singular Values",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "suppliedMaximumCondition",
          label: "Supplied Maximum Condition",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "conditionNumber",
          label: "Condition Number",
          valueType: { type: "number" },
        },
        {
          id: "minimumSingularValue",
          label: "Minimum Singular Value",
          valueType: { type: "number" },
        },
        {
          id: "exceedsSuppliedMaximum",
          label: "Exceeds Supplied Maximum",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = markerFrameConditionRatioTool.execute;
export default markerFrameConditionRatioTool;
