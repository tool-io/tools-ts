import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly before: number;
  readonly after: number;
  readonly quantile: number;
  readonly includeEquality: boolean;
};
export type Output = { readonly selected: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    before: { type: "number", minimum: 0, maximum: 1 },
    after: { type: "number", minimum: 0, maximum: 1 },
    quantile: { type: "number", minimum: 0, maximum: 1 },
    includeEquality: { type: "boolean" },
  },
  required: ["before", "after", "quantile", "includeEquality"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { selected: { type: "boolean" } },
  required: ["selected"],
} as const;
/** Calculate weighted quantile cumulative boundary choice from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { before, after, quantile, includeEquality } = input;
  const compute = (): Output => {
    H.probability(before);
    H.probability(after);
    H.probability(quantile);
    H.domain(before <= after);
    return {
      selected: includeEquality
        ? before < quantile && quantile <= after
        : before <= quantile && quantile < after,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { before: 0.25, after: 0.5, quantile: 0.5, includeEquality: true },
  output: { selected: true },
} satisfies ToolExample<Input, Output>;
export const weightedQuantileCumulativeBoundaryChoiceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "statistics/weighted-quantile-cumulative-boundary-choice",
      title: "Weighted Quantile Cumulative Boundary Choice Tool",
      description:
        "Calculate weighted quantile cumulative boundary choice from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          before: { type: "number", minimum: 0, maximum: 1 },
          after: { type: "number", minimum: 0, maximum: 1 },
          quantile: { type: "number", minimum: 0, maximum: 1 },
          includeEquality: { type: "boolean" },
        },
        required: ["before", "after", "quantile", "includeEquality"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { selected: { type: "boolean" } },
        required: ["selected"],
      },
      ports: {
        inputs: [
          {
            id: "before",
            label: "Before",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "after",
            label: "After",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "quantile",
            label: "Quantile",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "includeEquality",
            label: "Include Equality",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "selected", label: "Selected", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = weightedQuantileCumulativeBoundaryChoiceTool.execute;
export default weightedQuantileCumulativeBoundaryChoiceTool;
