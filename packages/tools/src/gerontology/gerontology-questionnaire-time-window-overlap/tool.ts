import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStart: number;
  readonly firstEnd: number;
  readonly secondStart: number;
  readonly secondEnd: number;
};
export type Output = {
  readonly overlap: number;
  readonly unionDuration: number;
  readonly overlapFractionOfUnion: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStart: { type: "number" },
    firstEnd: { type: "number" },
    secondStart: { type: "number" },
    secondEnd: { type: "number" },
  },
  required: ["firstStart", "firstEnd", "secondStart", "secondEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlap: { type: "number" },
    unionDuration: { type: "number" },
    overlapFractionOfUnion: { type: "number" },
  },
  required: ["overlap", "unionDuration", "overlapFractionOfUnion"],
} as const;
/** Recall-window duration intersection/union, excluding unobserved gaps from union duration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStart, firstEnd, secondStart, secondEnd } = request;
  const compute = (): Output => {
    H.domain(firstEnd > firstStart && secondEnd > secondStart);
    return {
      overlap: Math.max(
        0,
        Math.min(firstEnd, secondEnd) - Math.max(firstStart, secondStart),
      ),
      unionDuration:
        firstEnd -
        firstStart +
        secondEnd -
        secondStart -
        Math.max(
          0,
          Math.min(firstEnd, secondEnd) - Math.max(firstStart, secondStart),
        ),
      overlapFractionOfUnion:
        Math.max(
          0,
          Math.min(firstEnd, secondEnd) - Math.max(firstStart, secondStart),
        ) /
        (firstEnd -
          firstStart +
          secondEnd -
          secondStart -
          Math.max(
            0,
            Math.min(firstEnd, secondEnd) - Math.max(firstStart, secondStart),
          )),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstStart: 0, firstEnd: 30, secondStart: 20, secondEnd: 50 },
  output: { overlap: 10, unionDuration: 50, overlapFractionOfUnion: 0.2 },
} satisfies ToolExample<Input, Output>;
export const gerontologyQuestionnaireTimeWindowOverlapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gerontology/gerontology-questionnaire-time-window-overlap",
      title: "Gerontology Questionnaire Time Window Overlap Tool",
      description:
        "Recall-window duration intersection/union, excluding unobserved gaps from union duration.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstStart: { type: "number" },
          firstEnd: { type: "number" },
          secondStart: { type: "number" },
          secondEnd: { type: "number" },
        },
        required: ["firstStart", "firstEnd", "secondStart", "secondEnd"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          overlap: { type: "number" },
          unionDuration: { type: "number" },
          overlapFractionOfUnion: { type: "number" },
        },
        required: ["overlap", "unionDuration", "overlapFractionOfUnion"],
      },
      ports: {
        inputs: [
          {
            id: "firstStart",
            label: "First Start",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstEnd",
            label: "First End",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondStart",
            label: "Second Start",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondEnd",
            label: "Second End",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "overlap", label: "Overlap", valueType: { type: "number" } },
          {
            id: "unionDuration",
            label: "Union Duration",
            valueType: { type: "number" },
          },
          {
            id: "overlapFractionOfUnion",
            label: "Overlap Fraction Of Union",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = gerontologyQuestionnaireTimeWindowOverlapTool.execute;
export default gerontologyQuestionnaireTimeWindowOverlapTool;
