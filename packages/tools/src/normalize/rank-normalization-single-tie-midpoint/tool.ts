import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstRank: number;
  readonly lastRank: number;
  readonly count: number;
};
export type Output = { readonly midrank: number; readonly normalized: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstRank: { type: "integer", minimum: 1 },
    lastRank: { type: "integer" },
    count: { type: "integer", minimum: 2 },
  },
  required: ["firstRank", "lastRank", "count"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { midrank: { type: "number" }, normalized: { type: "number" } },
  required: ["midrank", "normalized"],
} as const;
/** Calculate rank normalization single tie midpoint from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { firstRank, lastRank, count } = input;
  const compute = (): Output => {
    H.integer(count, 2);
    H.integer(firstRank, 1, count);
    H.integer(lastRank, firstRank, count);
    const midrank = (firstRank + lastRank) / 2;
    return { midrank, normalized: (midrank - 1) / (count - 1) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { firstRank: 2, lastRank: 4, count: 5 },
  output: { midrank: 3, normalized: 0.5 },
} satisfies ToolExample<Input, Output>;
export const rankNormalizationSingleTieMidpointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/rank-normalization-single-tie-midpoint",
    title: "Rank Normalization Single Tie Midpoint Tool",
    description:
      "Calculate rank normalization single tie midpoint from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstRank: { type: "integer", minimum: 1 },
        lastRank: { type: "integer" },
        count: { type: "integer", minimum: 2 },
      },
      required: ["firstRank", "lastRank", "count"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        midrank: { type: "number" },
        normalized: { type: "number" },
      },
      required: ["midrank", "normalized"],
    },
    ports: {
      inputs: [
        {
          id: "firstRank",
          label: "First Rank",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lastRank",
          label: "Last Rank",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "midrank", label: "Midrank", valueType: { type: "number" } },
        {
          id: "normalized",
          label: "Normalized",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rankNormalizationSingleTieMidpointTool.execute;
export default rankNormalizationSingleTieMidpointTool;
