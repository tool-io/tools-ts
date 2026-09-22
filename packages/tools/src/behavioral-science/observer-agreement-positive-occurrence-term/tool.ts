import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bothPositive: number;
  readonly firstOnly: number;
  readonly secondOnly: number;
};
export type Output = {
  readonly positiveAgreement: number;
  readonly occurrenceIntersectionOverUnion: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bothPositive: { type: "integer", minimum: 0 },
    firstOnly: { type: "integer", minimum: 0 },
    secondOnly: { type: "integer", minimum: 0 },
  },
  required: ["bothPositive", "firstOnly", "secondOnly"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positiveAgreement: { type: "number" },
    occurrenceIntersectionOverUnion: { type: "number" },
  },
  required: ["positiveAgreement", "occurrenceIntersectionOverUnion"],
} as const;
/** Symmetric positive agreement excludes joint absences and uses 2a/(2a+b+c), separately from Jaccard a/(a+b+c). */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bothPositive, firstOnly, secondOnly } = request;
  const compute = (): Output => {
    H.integer(bothPositive, 0);
    H.integer(firstOnly, 0);
    H.integer(secondOnly, 0);
    H.domain(bothPositive + firstOnly + secondOnly > 0);
    return {
      positiveAgreement:
        (2 * bothPositive) / (2 * bothPositive + firstOnly + secondOnly),
      occurrenceIntersectionOverUnion:
        bothPositive / (bothPositive + firstOnly + secondOnly),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bothPositive: 6, firstOnly: 2, secondOnly: 2 },
  output: { positiveAgreement: 0.75, occurrenceIntersectionOverUnion: 0.6 },
} satisfies ToolExample<Input, Output>;
export const observerAgreementPositiveOccurrenceTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "behavioral-science/observer-agreement-positive-occurrence-term",
      title: "Observer Agreement Positive Occurrence Term Tool",
      description:
        "Symmetric positive agreement excludes joint absences and uses 2a/(2a+b+c), separately from Jaccard a/(a+b+c).",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          bothPositive: { type: "integer", minimum: 0 },
          firstOnly: { type: "integer", minimum: 0 },
          secondOnly: { type: "integer", minimum: 0 },
        },
        required: ["bothPositive", "firstOnly", "secondOnly"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          positiveAgreement: { type: "number" },
          occurrenceIntersectionOverUnion: { type: "number" },
        },
        required: ["positiveAgreement", "occurrenceIntersectionOverUnion"],
      },
      ports: {
        inputs: [
          {
            id: "bothPositive",
            label: "Both Positive",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "firstOnly",
            label: "First Only",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "secondOnly",
            label: "Second Only",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "positiveAgreement",
            label: "Positive Agreement",
            valueType: { type: "number" },
          },
          {
            id: "occurrenceIntersectionOverUnion",
            label: "Occurrence Intersection Over Union",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = observerAgreementPositiveOccurrenceTermTool.execute;
export default observerAgreementPositiveOccurrenceTermTool;
