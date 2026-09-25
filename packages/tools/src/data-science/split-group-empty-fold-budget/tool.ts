import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly groupCounts: readonly number[];
  readonly minimumGroups: number;
};
export type Output = {
  readonly emptyIndices: readonly number[];
  readonly insufficientIndices: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    groupCounts: { type: "array", maxItems: 256, items: { type: "integer" } },
    minimumGroups: { type: "integer", minimum: 0 },
  },
  required: ["groupCounts", "minimumGroups"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    emptyIndices: { type: "array", maxItems: 256, items: { type: "integer" } },
    insufficientIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["emptyIndices", "insufficientIndices"],
} as const;
/** Calculate split group empty fold budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { groupCounts, minimumGroups } = request;
  const compute = (): Output => {
    H.integer(minimumGroups, 0);
    H.domain(groupCounts.every((x) => x >= 0));
    return {
      emptyIndices: groupCounts.flatMap((x, i) => (x === 0 ? [i] : [])),
      insufficientIndices: groupCounts.flatMap((x, i) =>
        x < minimumGroups ? [i] : [],
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { groupCounts: [3, 0, 1], minimumGroups: 2 },
  output: { emptyIndices: [1], insufficientIndices: [1, 2] },
} satisfies ToolExample<Input, Output>;
export const splitGroupEmptyFoldBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/split-group-empty-fold-budget",
    title: "Split Group Empty Fold Budget Tool",
    description:
      "Calculate split group empty fold budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        groupCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        minimumGroups: { type: "integer", minimum: 0 },
      },
      required: ["groupCounts", "minimumGroups"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        emptyIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        insufficientIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["emptyIndices", "insufficientIndices"],
    },
    ports: {
      inputs: [
        {
          id: "groupCounts",
          label: "Group Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "minimumGroups",
          label: "Minimum Groups",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "emptyIndices",
          label: "Empty Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "insufficientIndices",
          label: "Insufficient Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = splitGroupEmptyFoldBudgetTool.execute;
export default splitGroupEmptyFoldBudgetTool;
