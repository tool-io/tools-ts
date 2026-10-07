import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly presentedItems: number;
  readonly scoredItems: number;
};
export type Output = {
  readonly unscoredItems: number;
  readonly scoredFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    presentedItems: { type: "integer", minimum: 1 },
    scoredItems: { type: "integer", minimum: 0 },
  },
  required: ["presentedItems", "scoredItems"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unscoredItems: { type: "integer" },
    scoredFraction: { type: "number" },
  },
  required: ["unscoredItems", "scoredFraction"],
} as const;
/** Reconcile explicitly presented and scored speech-list item counts without calculating a diagnostic score. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { presentedItems, scoredItems } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(presentedItems) &&
        presentedItems >= 1 &&
        presentedItems <= Number.MAX_SAFE_INTEGER,
      "presentedItems",
    ),
      presentedItems);
    (H.domain(
      Number.isSafeInteger(scoredItems) &&
        scoredItems >= 0 &&
        scoredItems <= presentedItems,
      "scoredItems",
    ),
      scoredItems);
    return {
      unscoredItems: presentedItems - scoredItems,
      scoredFraction: scoredItems / presentedItems,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { presentedItems: 25, scoredItems: 20 },
  output: { unscoredItems: 5, scoredFraction: 0.8 },
} satisfies ToolExample<Input, Output>;
export const speechListPresentedVersusScoredCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["audiology", "health and medicine"],
        keywords: ["audiology", "health and medicine"],
      },
      id: "audiology/speech-list-presented-versus-scored-count",
      title: "Speech List Presented Versus Scored Count",
      description:
        "Reconcile explicitly presented and scored speech-list item counts without calculating a diagnostic score.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          presentedItems: { type: "integer", minimum: 1 },
          scoredItems: { type: "integer", minimum: 0 },
        },
        required: ["presentedItems", "scoredItems"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unscoredItems: { type: "integer" },
          scoredFraction: { type: "number" },
        },
        required: ["unscoredItems", "scoredFraction"],
      },
      ports: {
        inputs: [
          {
            id: "presentedItems",
            label: "Presented Items",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "scoredItems",
            label: "Scored Items",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "unscoredItems",
            label: "Unscored Items",
            valueType: { type: "integer" },
          },
          {
            id: "scoredFraction",
            label: "Scored Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = speechListPresentedVersusScoredCountTool.execute;
export default speechListPresentedVersusScoredCountTool;
