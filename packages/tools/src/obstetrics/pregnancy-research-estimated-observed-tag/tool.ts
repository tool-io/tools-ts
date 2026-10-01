import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly sourceKind: string;
  readonly lower: number;
  readonly upper: number;
};
export type Output = {
  readonly observed: boolean;
  readonly estimated: boolean;
  readonly inside: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    sourceKind: {
      type: "string",
      maxLength: 8192,
      enum: ["observed", "estimated"],
    },
    lower: { type: "number" },
    upper: { type: "number" },
  },
  required: ["value", "sourceKind", "lower", "upper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "boolean" },
    estimated: { type: "boolean" },
    inside: { type: "boolean" },
  },
  required: ["observed", "estimated", "inside"],
} as const;
/** Retain explicit measurement provenance while checking supplied bounds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, sourceKind, lower, upper } = request;
  const compute = (): Output => {
    H.domain(["observed", "estimated"].includes(sourceKind), "sourceKind");
    H.domain(upper >= lower, "upper");
    return {
      observed: sourceKind === "observed",
      estimated: sourceKind === "estimated",
      inside: value >= lower && value <= upper,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 87, sourceKind: "estimated", lower: 80, upper: 90 },
  output: { observed: false, estimated: true, inside: true },
} satisfies ToolExample<Input, Output>;
export const pregnancyResearchEstimatedObservedTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "obstetrics/pregnancy-research-estimated-observed-tag",
      title: "Pregnancy Research Estimated Observed Tag Tool",
      description:
        "Retain explicit measurement provenance while checking supplied bounds.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          value: { type: "number" },
          sourceKind: {
            type: "string",
            maxLength: 8192,
            enum: ["observed", "estimated"],
          },
          lower: { type: "number" },
          upper: { type: "number" },
        },
        required: ["value", "sourceKind", "lower", "upper"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observed: { type: "boolean" },
          estimated: { type: "boolean" },
          inside: { type: "boolean" },
        },
        required: ["observed", "estimated", "inside"],
      },
      ports: {
        inputs: [
          {
            id: "value",
            label: "Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sourceKind",
            label: "Source Kind",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "lower",
            label: "Lower",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "upper",
            label: "Upper",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "observed", label: "Observed", valueType: { type: "boolean" } },
          {
            id: "estimated",
            label: "Estimated",
            valueType: { type: "boolean" },
          },
          { id: "inside", label: "Inside", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = pregnancyResearchEstimatedObservedTagTool.execute;
export default pregnancyResearchEstimatedObservedTagTool;
