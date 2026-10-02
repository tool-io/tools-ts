import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedOptions: readonly string[];
  readonly requiredOptions: readonly string[];
  readonly missingCodes: readonly string[];
};
export type Output = {
  readonly unrepresented: number;
  readonly explicitlyMissing: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedOptions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requiredOptions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    missingCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["observedOptions", "requiredOptions", "missingCodes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unrepresented: { type: "integer" },
    explicitlyMissing: { type: "integer" },
  },
  required: ["unrepresented", "explicitlyMissing"],
} as const;
/** Audit exact research-option tokens without interpreting missing responses as symptom scores. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedOptions, requiredOptions, missingCodes } = request;
  const compute = (): Output => {
    return {
      unrepresented: new Set(
        requiredOptions.filter((x) => !observedOptions.includes(x)),
      ).size,
      explicitlyMissing: observedOptions.filter((x) => missingCodes.includes(x))
        .length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedOptions: ["A", "NA"],
    requiredOptions: ["A", "B"],
    missingCodes: ["NA"],
  },
  output: { unrepresented: 1, explicitlyMissing: 1 },
} satisfies ToolExample<Input, Output>;
export const responseOptionMissingCodeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "psychiatry/response-option-missing-code-gap",
    title: "Response Option Missing Code Gap Tool",
    description:
      "Audit exact research-option tokens without interpreting missing responses as symptom scores.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedOptions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requiredOptions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        missingCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["observedOptions", "requiredOptions", "missingCodes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unrepresented: { type: "integer" },
        explicitlyMissing: { type: "integer" },
      },
      required: ["unrepresented", "explicitlyMissing"],
    },
    ports: {
      inputs: [
        {
          id: "observedOptions",
          label: "Observed Options",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requiredOptions",
          label: "Required Options",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "missingCodes",
          label: "Missing Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "unrepresented",
          label: "Unrepresented",
          valueType: { type: "integer" },
        },
        {
          id: "explicitlyMissing",
          label: "Explicitly Missing",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = responseOptionMissingCodeGapTool.execute;
export default responseOptionMissingCodeGapTool;
