import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly firstRank: number; readonly groupSize: number };
export type Output = { readonly midrank: number; readonly lastRank: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstRank: { type: "integer", minimum: 1 },
    groupSize: { type: "integer", minimum: 1 },
  },
  required: ["firstRank", "groupSize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { midrank: { type: "number" }, lastRank: { type: "integer" } },
  required: ["midrank", "lastRank"],
} as const;
/** Calculate spearman tie midrank one group from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstRank, groupSize } = request;
  const compute = (): Output => {
    H.integer(firstRank, 1);
    H.integer(groupSize, 1);
    return {
      midrank: firstRank + (groupSize - 1) / 2,
      lastRank: firstRank + groupSize - 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstRank: 3, groupSize: 4 },
  output: { midrank: 4.5, lastRank: 6 },
} satisfies ToolExample<Input, Output>;
export const spearmanTieMidrankOneGroupTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/spearman-tie-midrank-one-group",
    title: "Spearman Tie Midrank One Group Tool",
    description:
      "Calculate spearman tie midrank one group from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstRank: { type: "integer", minimum: 1 },
        groupSize: { type: "integer", minimum: 1 },
      },
      required: ["firstRank", "groupSize"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        midrank: { type: "number" },
        lastRank: { type: "integer" },
      },
      required: ["midrank", "lastRank"],
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
          id: "groupSize",
          label: "Group Size",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "midrank", label: "Midrank", valueType: { type: "number" } },
        { id: "lastRank", label: "Last Rank", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = spearmanTieMidrankOneGroupTool.execute;
export default spearmanTieMidrankOneGroupTool;
