import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstRanking: readonly string[];
  readonly secondRanking: readonly string[];
  readonly depth: number;
};
export type Output = {
  readonly overlapCount: number;
  readonly overlapFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstRanking: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    secondRanking: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    depth: { type: "integer", minimum: 1 },
  },
  required: ["firstRanking", "secondRanking", "depth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapCount: { type: "integer" },
    overlapFraction: { type: "number" },
  },
  required: ["overlapCount", "overlapFraction"],
} as const;
/** Measure overlap at a positive common prefix depth in two rankings with unique exact string identifiers. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstRanking, secondRanking, depth } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(depth) &&
        depth >= 1 &&
        depth <= Math.min(firstRanking.length, secondRanking.length),
      "depth",
    ),
      depth);
    H.domain(
      new Set(firstRanking).size === firstRanking.length &&
        new Set(secondRanking).size === secondRanking.length,
      "firstRanking",
    );
    const a = new Set(firstRanking.slice(0, depth));
    const overlapCount = secondRanking
      .slice(0, depth)
      .filter((v) => a.has(v)).length;
    return { overlapCount, overlapFraction: overlapCount / depth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstRanking: ["a", "b", "c"],
    secondRanking: ["b", "d", "a"],
    depth: 2,
  },
  output: { overlapCount: 1, overlapFraction: 0.5 },
} satisfies ToolExample<Input, Output>;
export const rankedPrefixOverlapDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/ranked-prefix-overlap-depth",
    title: "Ranked Prefix Overlap Depth Tool",
    description:
      "Measure overlap at a positive common prefix depth in two rankings with unique exact string identifiers.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstRanking: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        secondRanking: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        depth: { type: "integer", minimum: 1 },
      },
      required: ["firstRanking", "secondRanking", "depth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlapCount: { type: "integer" },
        overlapFraction: { type: "number" },
      },
      required: ["overlapCount", "overlapFraction"],
    },
    ports: {
      inputs: [
        {
          id: "firstRanking",
          label: "First Ranking",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "secondRanking",
          label: "Second Ranking",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "overlapCount",
          label: "Overlap Count",
          valueType: { type: "integer" },
        },
        {
          id: "overlapFraction",
          label: "Overlap Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rankedPrefixOverlapDepthTool.execute;
export default rankedPrefixOverlapDepthTool;
