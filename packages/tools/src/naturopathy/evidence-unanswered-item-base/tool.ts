import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly answered: number;
  readonly unanswered: number;
  readonly excluded: number;
  readonly countUnanswered: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly unansweredCount: number;
  readonly completion: number;
  readonly defined: boolean;
  readonly excludedCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    answered: { type: "integer", minimum: 0 },
    unanswered: { type: "integer", minimum: 0 },
    excluded: { type: "integer", minimum: 0 },
    countUnanswered: { type: "boolean" },
  },
  required: ["answered", "unanswered", "excluded", "countUnanswered"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    unansweredCount: { type: "integer" },
    completion: { type: "number" },
    defined: { type: "boolean" },
    excludedCount: { type: "integer" },
  },
  required: [
    "denominator",
    "unansweredCount",
    "completion",
    "defined",
    "excludedCount",
  ],
} as const;
/** Audit research checklist completion with excluded entries validated and omitted from the denominator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { answered, unanswered, excluded, countUnanswered } = request;
  const compute = (): Output => {
    H.integer(answered, 0);
    H.integer(unanswered, 0);
    H.integer(excluded, 0);
    return {
      excludedCount: excluded,
      denominator: answered + (countUnanswered ? unanswered : 0),
      unansweredCount: unanswered,
      completion:
        answered + (countUnanswered ? unanswered : 0) > 0
          ? answered / (answered + (countUnanswered ? unanswered : 0))
          : 0,
      defined: answered + (countUnanswered ? unanswered : 0) > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { answered: 8, unanswered: 2, excluded: 3, countUnanswered: true },
  output: {
    denominator: 10,
    unansweredCount: 2,
    completion: 0.8,
    defined: true,
    excludedCount: 3,
  },
} satisfies ToolExample<Input, Output>;
export const evidenceUnansweredItemBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "naturopathy/evidence-unanswered-item-base",
    title: "Evidence Unanswered Item Base Tool",
    description:
      "Audit research checklist completion with excluded entries validated and omitted from the denominator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        answered: { type: "integer", minimum: 0 },
        unanswered: { type: "integer", minimum: 0 },
        excluded: { type: "integer", minimum: 0 },
        countUnanswered: { type: "boolean" },
      },
      required: ["answered", "unanswered", "excluded", "countUnanswered"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        unansweredCount: { type: "integer" },
        completion: { type: "number" },
        defined: { type: "boolean" },
        excludedCount: { type: "integer" },
      },
      required: [
        "denominator",
        "unansweredCount",
        "completion",
        "defined",
        "excludedCount",
      ],
    },
    ports: {
      inputs: [
        {
          id: "answered",
          label: "Answered",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unanswered",
          label: "Unanswered",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excluded",
          label: "Excluded",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "countUnanswered",
          label: "Count Unanswered",
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
          id: "unansweredCount",
          label: "Unanswered Count",
          valueType: { type: "integer" },
        },
        {
          id: "completion",
          label: "Completion",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        {
          id: "excludedCount",
          label: "Excluded Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = evidenceUnansweredItemBaseTool.execute;
export default evidenceUnansweredItemBaseTool;
