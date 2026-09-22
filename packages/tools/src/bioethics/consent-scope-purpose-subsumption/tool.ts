import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requested: readonly string[];
  readonly granted: readonly string[];
  readonly expresslyExcluded: readonly string[];
};
export type Output = {
  readonly uncovered: readonly string[];
  readonly excluded: readonly string[];
  readonly coveredUnderTokens: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requested: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    granted: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    expresslyExcluded: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requested", "granted", "expresslyExcluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncovered: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    excluded: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    coveredUnderTokens: { type: "boolean" },
  },
  required: ["uncovered", "excluded", "coveredUnderTokens"],
} as const;
/** Exact purpose-token inclusion and exclusions; broader semantic or legal subsumption is not inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requested, granted, expresslyExcluded } = request;
  const compute = (): Output => {
    const uncovered = [
        ...new Set(requested.filter((x) => !granted.includes(x))),
      ],
      excluded = [
        ...new Set(requested.filter((x) => expresslyExcluded.includes(x))),
      ];
    return {
      uncovered,
      excluded,
      coveredUnderTokens: uncovered.length === 0 && excluded.length === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requested: ["analysis", "share"],
    granted: ["analysis", "share"],
    expresslyExcluded: ["share"],
  },
  output: { uncovered: [], excluded: ["share"], coveredUnderTokens: false },
} satisfies ToolExample<Input, Output>;
export const consentScopePurposeSubsumptionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioethics/consent-scope-purpose-subsumption",
    title: "Consent Scope Purpose Subsumption Tool",
    description:
      "Exact purpose-token inclusion and exclusions; broader semantic or legal subsumption is not inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requested: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        granted: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        expresslyExcluded: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["requested", "granted", "expresslyExcluded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uncovered: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        excluded: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        coveredUnderTokens: { type: "boolean" },
      },
      required: ["uncovered", "excluded", "coveredUnderTokens"],
    },
    ports: {
      inputs: [
        {
          id: "requested",
          label: "Requested",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "granted",
          label: "Granted",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "expresslyExcluded",
          label: "Expressly Excluded",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "uncovered",
          label: "Uncovered",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "excluded",
          label: "Excluded",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "coveredUnderTokens",
          label: "Covered Under Tokens",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = consentScopePurposeSubsumptionTool.execute;
export default consentScopePurposeSubsumptionTool;
