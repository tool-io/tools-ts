import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scoreSum: number;
  readonly answeredItems: number;
  readonly plannedItems: number;
  readonly excludeUnanswered: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly meanScore: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scoreSum: { type: "number" },
    answeredItems: { type: "integer", minimum: 0 },
    plannedItems: { type: "integer", minimum: 0 },
    excludeUnanswered: { type: "boolean" },
  },
  required: ["scoreSum", "answeredItems", "plannedItems", "excludeUnanswered"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    meanScore: { type: "number" },
  },
  required: ["denominator", "meanScore"],
} as const;
/** Calculate a supplied subscore mean using an explicit answered-only or planned-item denominator without imputing item responses. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scoreSum, answeredItems, plannedItems, excludeUnanswered } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(plannedItems) &&
        plannedItems >= 0 &&
        plannedItems <= Number.MAX_SAFE_INTEGER,
      "plannedItems",
    ),
      plannedItems);
    (H.domain(
      Number.isSafeInteger(answeredItems) &&
        answeredItems >= 0 &&
        answeredItems <= plannedItems,
      "answeredItems",
    ),
      answeredItems);
    return (() => {
      const denominator = excludeUnanswered ? answeredItems : plannedItems;
      H.domain(
        denominator > 0,
        excludeUnanswered ? "answeredItems" : "plannedItems",
      );
      return { denominator, meanScore: scoreSum / denominator };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    scoreSum: 12,
    answeredItems: 3,
    plannedItems: 4,
    excludeUnanswered: true,
  },
  output: { denominator: 3, meanScore: 4 },
} satisfies ToolExample<Input, Output>;
export const scaleSubscoreAvailableItemDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "educational-psychology/scale-subscore-available-item-denominator",
      title: "Scale Subscore Available Item Denominator Tool",
      description:
        "Calculate a supplied subscore mean using an explicit answered-only or planned-item denominator without imputing item responses.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          scoreSum: { type: "number" },
          answeredItems: { type: "integer", minimum: 0 },
          plannedItems: { type: "integer", minimum: 0 },
          excludeUnanswered: { type: "boolean" },
        },
        required: [
          "scoreSum",
          "answeredItems",
          "plannedItems",
          "excludeUnanswered",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "integer" },
          meanScore: { type: "number" },
        },
        required: ["denominator", "meanScore"],
      },
      ports: {
        inputs: [
          {
            id: "scoreSum",
            label: "Score Sum",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "answeredItems",
            label: "Answered Items",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "plannedItems",
            label: "Planned Items",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "excludeUnanswered",
            label: "Exclude Unanswered",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "denominator",
            label: "Denominator",
            valueType: { type: "integer" },
          },
          {
            id: "meanScore",
            label: "Mean Score",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = scaleSubscoreAvailableItemDenominatorTool.execute;
export default scaleSubscoreAvailableItemDenominatorTool;
