import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedValue: number;
  readonly suppliedThreshold: number;
  readonly comparison: string;
};
export type Output = { readonly meetsSuppliedRule: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedValue: { type: "number" },
    suppliedThreshold: { type: "number" },
    comparison: {
      type: "string",
      maxLength: 8192,
      enum: ["above", "at-least", "below", "at-most"],
    },
  },
  required: ["observedValue", "suppliedThreshold", "comparison"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { meetsSuppliedRule: { type: "boolean" } },
  required: ["meetsSuppliedRule"],
} as const;
/** Apply one caller-supplied numerical comparison without establishing that a rule was preregistered or statistically appropriate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedValue, suppliedThreshold, comparison } = request;
  const compute = (): Output => {
    H.domain(
      ["above", "at-least", "below", "at-most"].includes(comparison),
      "comparison",
    );
    return {
      meetsSuppliedRule:
        comparison === "above"
          ? observedValue > suppliedThreshold
          : comparison === "at-least"
            ? observedValue >= suppliedThreshold
            : comparison === "below"
              ? observedValue < suppliedThreshold
              : observedValue <= suppliedThreshold,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedValue: 4, suppliedThreshold: 3, comparison: "above" },
  output: { meetsSuppliedRule: true },
} satisfies ToolExample<Input, Output>;
export const preRegisteredRuleThresholdDecisionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "experimental-psychology",
        "experimental psychology",
        "psychology",
      ],
      keywords: ["experimental psychology", "psychology"],
    },
    id: "experimental-psychology/pre-registered-rule-threshold-decision",
    title: "Pre Registered Rule Threshold Decision",
    description:
      "Apply one caller-supplied numerical comparison without establishing that a rule was preregistered or statistically appropriate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedValue: { type: "number" },
        suppliedThreshold: { type: "number" },
        comparison: {
          type: "string",
          maxLength: 8192,
          enum: ["above", "at-least", "below", "at-most"],
        },
      },
      required: ["observedValue", "suppliedThreshold", "comparison"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { meetsSuppliedRule: { type: "boolean" } },
      required: ["meetsSuppliedRule"],
    },
    ports: {
      inputs: [
        {
          id: "observedValue",
          label: "Observed Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedThreshold",
          label: "Supplied Threshold",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "comparison",
          label: "Comparison",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "meetsSuppliedRule",
          label: "Meets Supplied Rule",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = preRegisteredRuleThresholdDecisionTool.execute;
export default preRegisteredRuleThresholdDecisionTool;
