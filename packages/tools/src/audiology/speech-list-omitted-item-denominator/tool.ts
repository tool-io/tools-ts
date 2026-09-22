import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly correct: number;
  readonly incorrect: number;
  readonly omitted: number;
  readonly includeOmitted: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly correctShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correct: { type: "integer", minimum: 0 },
    incorrect: { type: "integer", minimum: 0 },
    omitted: { type: "integer", minimum: 0 },
    includeOmitted: { type: "boolean" },
  },
  required: ["correct", "incorrect", "omitted", "includeOmitted"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    correctShare: { type: "number" },
  },
  required: ["denominator", "correctShare"],
} as const;
/** Supplied speech-list scoring denominator; no diagnostic scale or normative cutoff is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { correct, incorrect, omitted, includeOmitted } = request;
  const compute = (): Output => {
    H.integer(correct, 0);
    H.integer(incorrect, 0);
    H.integer(omitted, 0);
    H.domain(correct + incorrect > 0);
    return {
      denominator: correct + incorrect + (includeOmitted ? omitted : 0),
      correctShare:
        correct / (correct + incorrect + (includeOmitted ? omitted : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { correct: 16, incorrect: 4, omitted: 5, includeOmitted: false },
  output: { denominator: 20, correctShare: 0.8 },
} satisfies ToolExample<Input, Output>;
export const speechListOmittedItemDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "audiology/speech-list-omitted-item-denominator",
    title: "Speech List Omitted Item Denominator Tool",
    description:
      "Supplied speech-list scoring denominator; no diagnostic scale or normative cutoff is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correct: { type: "integer", minimum: 0 },
        incorrect: { type: "integer", minimum: 0 },
        omitted: { type: "integer", minimum: 0 },
        includeOmitted: { type: "boolean" },
      },
      required: ["correct", "incorrect", "omitted", "includeOmitted"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        correctShare: { type: "number" },
      },
      required: ["denominator", "correctShare"],
    },
    ports: {
      inputs: [
        {
          id: "correct",
          label: "Correct",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "incorrect",
          label: "Incorrect",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "omitted",
          label: "Omitted",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeOmitted",
          label: "Include Omitted",
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
          id: "correctShare",
          label: "Correct Share",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = speechListOmittedItemDenominatorTool.execute;
export default speechListOmittedItemDenominatorTool;
