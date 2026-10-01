import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resolutionLimit: number;
  readonly observedSize: number;
  readonly belowLimit: boolean;
  readonly useHalfLimit: boolean;
};
export type Output = {
  readonly analysisValue: number;
  readonly substituted: boolean;
  readonly upperCensorBound: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resolutionLimit: { type: "number", minimum: 0 },
    observedSize: { type: "number", minimum: 0 },
    belowLimit: { type: "boolean" },
    useHalfLimit: { type: "boolean" },
  },
  required: ["resolutionLimit", "observedSize", "belowLimit", "useHalfLimit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    analysisValue: { type: "number" },
    substituted: { type: "boolean" },
    upperCensorBound: { type: "number" },
  },
  required: ["analysisValue", "substituted", "upperCensorBound"],
} as const;
/** Explicit caller-requested zero/half-limit research substitution with a retained censor bound; no unmeasured size or clinical category is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resolutionLimit, observedSize, belowLimit, useHalfLimit } = request;
  const compute = (): Output => {
    H.domain(resolutionLimit >= 0 && observedSize >= 0);
    return {
      analysisValue: belowLimit
        ? useHalfLimit
          ? resolutionLimit / 2
          : 0
        : observedSize,
      substituted: belowLimit,
      upperCensorBound: belowLimit ? resolutionLimit : observedSize,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    resolutionLimit: 2,
    observedSize: 0,
    belowLimit: true,
    useHalfLimit: true,
  },
  output: { analysisValue: 1, substituted: true, upperCensorBound: 2 },
} satisfies ToolExample<Input, Output>;
export const tumorResearchCensoredSizeBoundTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oncology/tumor-research-censored-size-bound",
    title: "Tumor Research Censored Size Bound Tool",
    description:
      "Explicit caller-requested zero/half-limit research substitution with a retained censor bound; no unmeasured size or clinical category is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resolutionLimit: { type: "number", minimum: 0 },
        observedSize: { type: "number", minimum: 0 },
        belowLimit: { type: "boolean" },
        useHalfLimit: { type: "boolean" },
      },
      required: [
        "resolutionLimit",
        "observedSize",
        "belowLimit",
        "useHalfLimit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        analysisValue: { type: "number" },
        substituted: { type: "boolean" },
        upperCensorBound: { type: "number" },
      },
      required: ["analysisValue", "substituted", "upperCensorBound"],
    },
    ports: {
      inputs: [
        {
          id: "resolutionLimit",
          label: "Resolution Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedSize",
          label: "Observed Size",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "belowLimit",
          label: "Below Limit",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "useHalfLimit",
          label: "Use Half Limit",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "analysisValue",
          label: "Analysis Value",
          valueType: { type: "number" },
        },
        {
          id: "substituted",
          label: "Substituted",
          valueType: { type: "boolean" },
        },
        {
          id: "upperCensorBound",
          label: "Upper Censor Bound",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tumorResearchCensoredSizeBoundTool.execute;
export default tumorResearchCensoredSizeBoundTool;
