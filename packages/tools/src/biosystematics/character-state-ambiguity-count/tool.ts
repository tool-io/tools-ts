import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stateSets: readonly string[];
  readonly missingTokens: readonly string[];
  readonly separator: string;
};
export type Output = { readonly ambiguous: number; readonly missing: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stateSets: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    missingTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["stateSets", "missingTokens", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ambiguous: { type: "integer" }, missing: { type: "integer" } },
  required: ["ambiguous", "missing"],
} as const;
/** Count explicitly supplied alternative-state tokens under a declared grammar without character inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stateSets, missingTokens, separator } = request;
  const compute = (): Output => {
    H.domain(
      separator.length > 0 &&
        stateSets.every(
          (x) =>
            missingTokens.includes(x) ||
            x.split(separator).every((t) => t.length > 0),
        ),
    );
    return {
      ambiguous: stateSets.filter(
        (x) =>
          !missingTokens.includes(x) && new Set(x.split(separator)).size > 1,
      ).length,
      missing: stateSets.filter((x) => missingTokens.includes(x)).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stateSets: ["A", "A/B", "?"], missingTokens: ["?"], separator: "/" },
  output: { ambiguous: 1, missing: 1 },
} satisfies ToolExample<Input, Output>;
export const characterStateAmbiguityCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosystematics/character-state-ambiguity-count",
    title: "Character State Ambiguity Count Tool",
    description:
      "Count explicitly supplied alternative-state tokens under a declared grammar without character inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stateSets: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        missingTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["stateSets", "missingTokens", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ambiguous: { type: "integer" },
        missing: { type: "integer" },
      },
      required: ["ambiguous", "missing"],
    },
    ports: {
      inputs: [
        {
          id: "stateSets",
          label: "State Sets",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "missingTokens",
          label: "Missing Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "ambiguous", label: "Ambiguous", valueType: { type: "integer" } },
        { id: "missing", label: "Missing", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = characterStateAmbiguityCountTool.execute;
export default characterStateAmbiguityCountTool;
