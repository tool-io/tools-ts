import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initials: string;
  readonly legendInitials: readonly string[];
  readonly names: readonly string[];
};
export type Output = {
  readonly found: boolean;
  readonly ambiguous: boolean;
  readonly matchingNames: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initials: { type: "string", maxLength: 8192 },
    legendInitials: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    names: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["initials", "legendInitials", "names"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    found: { type: "boolean" },
    ambiguous: { type: "boolean" },
    matchingNames: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["found", "ambiguous", "matchingNames"],
} as const;
/** Match supplied signature initials against an explicit legend and retain ambiguity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initials, legendInitials, names } = request;
  const compute = (): Output => {
    H.sameLength(legendInitials, names);
    const matchingNames = [
      ...new Set(names.filter((_, i) => legendInitials[i] === initials)),
    ];
    return {
      found: matchingNames.length > 0,
      ambiguous: matchingNames.length > 1,
      matchingNames,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initials: "AB",
    legendInitials: ["AB", "CD", "AB"],
    names: ["Alice", "Carol", "Alex"],
  },
  output: { found: true, ambiguous: true, matchingNames: ["Alice", "Alex"] },
} satisfies ToolExample<Input, Output>;
export const glpSignatureInitialLegendMatchTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "glp/glp-signature-initial-legend-match",
    title: "GLP Signature Initial Legend Match Tool",
    description:
      "Match supplied signature initials against an explicit legend and retain ambiguity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initials: { type: "string", maxLength: 8192 },
        legendInitials: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        names: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["initials", "legendInitials", "names"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        found: { type: "boolean" },
        ambiguous: { type: "boolean" },
        matchingNames: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["found", "ambiguous", "matchingNames"],
    },
    ports: {
      inputs: [
        {
          id: "initials",
          label: "Initials",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "legendInitials",
          label: "Legend Initials",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "names",
          label: "Names",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "found", label: "Found", valueType: { type: "boolean" } },
        { id: "ambiguous", label: "Ambiguous", valueType: { type: "boolean" } },
        {
          id: "matchingNames",
          label: "Matching Names",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = glpSignatureInitialLegendMatchTool.execute;
export default glpSignatureInitialLegendMatchTool;
