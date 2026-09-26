import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly answer: string;
  readonly accepted: readonly string[];
  readonly caseSensitive: boolean;
  readonly trim: boolean;
};
export type Output = {
  readonly correct: boolean;
  readonly matchedIndex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    answer: { type: "string", maxLength: 8192 },
    accepted: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    caseSensitive: { type: "boolean" },
    trim: { type: "boolean" },
  },
  required: ["answer", "accepted", "caseSensitive", "trim"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correct: { type: "boolean" },
    matchedIndex: { type: "integer" },
  },
  required: ["correct", "matchedIndex"],
} as const;
/** Calculate answer key multiple accepted token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { answer, accepted, caseSensitive, trim } = request;
  const compute = (): Output => {
    const normalize = (s: string) => {
      const t = trim ? s.trim() : s;
      return caseSensitive ? t : t.toLowerCase();
    };
    const matchedIndex = accepted.findIndex(
      (x) => normalize(x) === normalize(answer),
    );
    return { correct: matchedIndex >= 0, matchedIndex };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    answer: " YES ",
    accepted: ["yes", "true"],
    caseSensitive: false,
    trim: true,
  },
  output: { correct: true, matchedIndex: 0 },
} satisfies ToolExample<Input, Output>;
export const answerKeyMultipleAcceptedTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/answer-key-multiple-accepted-token",
    title: "Answer Key Multiple Accepted Token Tool",
    description:
      "Calculate answer key multiple accepted token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        answer: { type: "string", maxLength: 8192 },
        accepted: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        caseSensitive: { type: "boolean" },
        trim: { type: "boolean" },
      },
      required: ["answer", "accepted", "caseSensitive", "trim"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correct: { type: "boolean" },
        matchedIndex: { type: "integer" },
      },
      required: ["correct", "matchedIndex"],
    },
    ports: {
      inputs: [
        {
          id: "answer",
          label: "Answer",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "accepted",
          label: "Accepted",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "caseSensitive",
          label: "Case Sensitive",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "trim",
          label: "Trim",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "correct", label: "Correct", valueType: { type: "boolean" } },
        {
          id: "matchedIndex",
          label: "Matched Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = answerKeyMultipleAcceptedTokenTool.execute;
export default answerKeyMultipleAcceptedTokenTool;
