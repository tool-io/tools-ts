import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly knownScores: readonly number[];
  readonly missingItems: number;
  readonly itemMinimum: number;
  readonly itemMaximum: number;
};
export type Output = {
  readonly knownSum: number;
  readonly minimumTotal: number;
  readonly maximumTotal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    knownScores: { type: "array", maxItems: 256, items: { type: "number" } },
    missingItems: { type: "integer", minimum: 0 },
    itemMinimum: { type: "number" },
    itemMaximum: { type: "number" },
  },
  required: ["knownScores", "missingItems", "itemMinimum", "itemMaximum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    knownSum: { type: "number" },
    minimumTotal: { type: "number" },
    maximumTotal: { type: "number" },
  },
  required: ["knownSum", "minimumTotal", "maximumTotal"],
} as const;
/** Possible research scale-total bounds from explicit item limits, without a proprietary key, imputation or clinical score interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { knownScores, missingItems, itemMinimum, itemMaximum } = request;
  const compute = (): Output => {
    H.integer(missingItems, 0);
    H.domain(
      itemMaximum >= itemMinimum &&
        knownScores.every((x) => x >= itemMinimum && x <= itemMaximum),
    );
    return {
      knownSum: knownScores.reduce((a, b) => a + b, 0),
      minimumTotal:
        knownScores.reduce((a, b) => a + b, 0) + missingItems * itemMinimum,
      maximumTotal:
        knownScores.reduce((a, b) => a + b, 0) + missingItems * itemMaximum,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    knownScores: [1, 3, 2],
    missingItems: 2,
    itemMinimum: 0,
    itemMaximum: 4,
  },
  output: { knownSum: 6, minimumTotal: 6, maximumTotal: 14 },
} satisfies ToolExample<Input, Output>;
export const neurologicalScaleResearchMissingItemTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "neurology/neurological-scale-research-missing-item-term",
      title: "Neurological Scale Research Missing Item Term Tool",
      description:
        "Possible research scale-total bounds from explicit item limits, without a proprietary key, imputation or clinical score interpretation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          knownScores: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          missingItems: { type: "integer", minimum: 0 },
          itemMinimum: { type: "number" },
          itemMaximum: { type: "number" },
        },
        required: ["knownScores", "missingItems", "itemMinimum", "itemMaximum"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          knownSum: { type: "number" },
          minimumTotal: { type: "number" },
          maximumTotal: { type: "number" },
        },
        required: ["knownSum", "minimumTotal", "maximumTotal"],
      },
      ports: {
        inputs: [
          {
            id: "knownScores",
            label: "Known Scores",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "missingItems",
            label: "Missing Items",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "itemMinimum",
            label: "Item Minimum",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "itemMaximum",
            label: "Item Maximum",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "knownSum", label: "Known Sum", valueType: { type: "number" } },
          {
            id: "minimumTotal",
            label: "Minimum Total",
            valueType: { type: "number" },
          },
          {
            id: "maximumTotal",
            label: "Maximum Total",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = neurologicalScaleResearchMissingItemTermTool.execute;
export default neurologicalScaleResearchMissingItemTermTool;
