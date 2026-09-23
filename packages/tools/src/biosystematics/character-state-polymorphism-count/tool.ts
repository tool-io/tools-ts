import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stateTokens: readonly string[];
  readonly missingTokens: readonly string[];
};
export type Output = {
  readonly distinctStates: readonly string[];
  readonly stateCount: number;
  readonly polymorphicUnderTokens: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stateTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    missingTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["stateTokens", "missingTokens"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distinctStates: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    stateCount: { type: "integer" },
    polymorphicUnderTokens: { type: "boolean" },
  },
  required: ["distinctStates", "stateCount", "polymorphicUnderTokens"],
} as const;
/** Count distinct supplied known character-state tokens without imputing states or inferring biological mechanisms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stateTokens, missingTokens } = request;
  const compute = (): Output => {
    const distinctStates = [
      ...new Set(stateTokens.filter((x) => !missingTokens.includes(x))),
    ];
    return {
      distinctStates,
      stateCount: distinctStates.length,
      polymorphicUnderTokens: distinctStates.length > 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stateTokens: ["0", "1", "1", "?"], missingTokens: ["?"] },
  output: {
    distinctStates: ["0", "1"],
    stateCount: 2,
    polymorphicUnderTokens: true,
  },
} satisfies ToolExample<Input, Output>;
export const characterStatePolymorphismCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosystematics/character-state-polymorphism-count",
    title: "Character State Polymorphism Count Tool",
    description:
      "Count distinct supplied known character-state tokens without imputing states or inferring biological mechanisms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stateTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        missingTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["stateTokens", "missingTokens"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distinctStates: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        stateCount: { type: "integer" },
        polymorphicUnderTokens: { type: "boolean" },
      },
      required: ["distinctStates", "stateCount", "polymorphicUnderTokens"],
    },
    ports: {
      inputs: [
        {
          id: "stateTokens",
          label: "State Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "missingTokens",
          label: "Missing Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "distinctStates",
          label: "Distinct States",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "stateCount",
          label: "State Count",
          valueType: { type: "integer" },
        },
        {
          id: "polymorphicUnderTokens",
          label: "Polymorphic Under Tokens",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = characterStatePolymorphismCountTool.execute;
export default characterStatePolymorphismCountTool;
