import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStart: number;
  readonly firstEnd: number;
  readonly secondStart: number;
  readonly secondEnd: number;
};
export type Output = {
  readonly overlapDuration: number;
  readonly relation: string;
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
    overlapDuration: { type: "number" },
    relation: { type: "string", maxLength: 8192 },
  },
  required: ["overlapDuration", "relation"],
} as const;
/** Classify explicit frog-call time brackets as positive overlap, boundary touch or disjoint without detecting or identifying calls. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStart, firstEnd, secondStart, secondEnd } = request;
  const compute = (): Output => {
    H.domain(firstEnd >= firstStart, "firstEnd");
    H.domain(secondEnd >= secondStart, "secondEnd");
    return (() => {
      const gap =
        Math.min(firstEnd, secondEnd) - Math.max(firstStart, secondStart);
      return {
        overlapDuration: Math.max(0, gap),
        relation: gap > 0 ? "overlap" : gap === 0 ? "touch" : "disjoint",
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstStart: 1, firstEnd: 5, secondStart: 3, secondEnd: 8 },
  output: { overlapDuration: 2, relation: "overlap" },
} satisfies ToolExample<Input, Output>;
export const acousticSurveyFrogCallOverlapLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "herpetology/acoustic-survey-frog-call-overlap-label",
    title: "Acoustic Survey Frog Call Overlap Label Tool",
    description:
      "Classify explicit frog-call time brackets as positive overlap, boundary touch or disjoint without detecting or identifying calls.",
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
        overlapDuration: { type: "number" },
        relation: { type: "string", maxLength: 8192 },
      },
      required: ["overlapDuration", "relation"],
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
        {
          id: "overlapDuration",
          label: "Overlap Duration",
          valueType: { type: "number" },
        },
        { id: "relation", label: "Relation", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = acousticSurveyFrogCallOverlapLabelTool.execute;
export default acousticSurveyFrogCallOverlapLabelTool;
