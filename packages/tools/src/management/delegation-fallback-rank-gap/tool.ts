import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly orderedDelegates: readonly string[];
  readonly primary: string;
  readonly fallback: string;
  readonly available: readonly boolean[];
};
export type Output = {
  readonly primaryRank: number;
  readonly fallbackRank: number;
  readonly rankGap: number;
  readonly fallbackAvailable: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orderedDelegates: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    primary: { type: "string", maxLength: 8192 },
    fallback: { type: "string", maxLength: 8192 },
    available: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["orderedDelegates", "primary", "fallback", "available"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    primaryRank: { type: "integer" },
    fallbackRank: { type: "integer" },
    rankGap: { type: "integer" },
    fallbackAvailable: { type: "boolean" },
  },
  required: ["primaryRank", "fallbackRank", "rankGap", "fallbackAvailable"],
} as const;
/** Calculate delegation fallback rank gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { orderedDelegates, primary, fallback, available } = request;
  const compute = (): Output => {
    H.sameLength(orderedDelegates, available);
    H.domain(new Set(orderedDelegates).size === orderedDelegates.length);
    return (() => {
      const primaryRank = orderedDelegates.indexOf(primary),
        fallbackRank = orderedDelegates.indexOf(fallback);
      H.domain(primaryRank >= 0 && fallbackRank >= 0);
      return {
        primaryRank,
        fallbackRank,
        rankGap: fallbackRank - primaryRank,
        fallbackAvailable: available[fallbackRank],
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    orderedDelegates: ["A", "B", "C"],
    primary: "A",
    fallback: "C",
    available: [true, false, true],
  },
  output: {
    primaryRank: 0,
    fallbackRank: 2,
    rankGap: 2,
    fallbackAvailable: true,
  },
} satisfies ToolExample<Input, Output>;
export const delegationFallbackRankGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/delegation-fallback-rank-gap",
    title: "Delegation Fallback Rank Gap Tool",
    description:
      "Calculate delegation fallback rank gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orderedDelegates: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        primary: { type: "string", maxLength: 8192 },
        fallback: { type: "string", maxLength: 8192 },
        available: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["orderedDelegates", "primary", "fallback", "available"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        primaryRank: { type: "integer" },
        fallbackRank: { type: "integer" },
        rankGap: { type: "integer" },
        fallbackAvailable: { type: "boolean" },
      },
      required: ["primaryRank", "fallbackRank", "rankGap", "fallbackAvailable"],
    },
    ports: {
      inputs: [
        {
          id: "orderedDelegates",
          label: "Ordered Delegates",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "primary",
          label: "Primary",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "fallback",
          label: "Fallback",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "available",
          label: "Available",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "primaryRank",
          label: "Primary Rank",
          valueType: { type: "integer" },
        },
        {
          id: "fallbackRank",
          label: "Fallback Rank",
          valueType: { type: "integer" },
        },
        { id: "rankGap", label: "Rank Gap", valueType: { type: "integer" } },
        {
          id: "fallbackAvailable",
          label: "Fallback Available",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = delegationFallbackRankGapTool.execute;
export default delegationFallbackRankGapTool;
