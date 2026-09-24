import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly threshold: number;
  readonly direction: string;
  readonly equalityCounts: boolean;
};
export type Output = {
  readonly signedMargin: number;
  readonly meets: boolean;
  readonly equal: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    threshold: { type: "number" },
    direction: { type: "string", maxLength: 8192, enum: ["above", "below"] },
    equalityCounts: { type: "boolean" },
  },
  required: ["value", "threshold", "direction", "equalityCounts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedMargin: { type: "number" },
    meets: { type: "boolean" },
    equal: { type: "boolean" },
  },
  required: ["signedMargin", "meets", "equal"],
} as const;
/** Apply an explicit research threshold direction and equality rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, threshold, direction, equalityCounts } = request;
  const compute = (): Output => {
    H.domain(["above", "below"].includes(direction), "direction");
    return {
      signedMargin: (direction === "above" ? 1 : -1) * (value - threshold),
      meets:
        direction === "above"
          ? equalityCounts
            ? value >= threshold
            : value > threshold
          : equalityCounts
            ? value <= threshold
            : value < threshold,
      equal: value === threshold,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 5, threshold: 5, direction: "above", equalityCounts: false },
  output: { signedMargin: 0, meets: false, equal: true },
} satisfies ToolExample<Input, Output>;
export const researchSuppliedThresholdEqualityRuleTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "clinical-research/research-supplied-threshold-equality-rule",
      title: "Research Supplied Threshold Equality Rule Tool",
      description:
        "Apply an explicit research threshold direction and equality rule.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          value: { type: "number" },
          threshold: { type: "number" },
          direction: {
            type: "string",
            maxLength: 8192,
            enum: ["above", "below"],
          },
          equalityCounts: { type: "boolean" },
        },
        required: ["value", "threshold", "direction", "equalityCounts"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          signedMargin: { type: "number" },
          meets: { type: "boolean" },
          equal: { type: "boolean" },
        },
        required: ["signedMargin", "meets", "equal"],
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
            id: "threshold",
            label: "Threshold",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "direction",
            label: "Direction",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "equalityCounts",
            label: "Equality Counts",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "signedMargin",
            label: "Signed Margin",
            valueType: { type: "number" },
          },
          { id: "meets", label: "Meets", valueType: { type: "boolean" } },
          { id: "equal", label: "Equal", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = researchSuppliedThresholdEqualityRuleTool.execute;
export default researchSuppliedThresholdEqualityRuleTool;
