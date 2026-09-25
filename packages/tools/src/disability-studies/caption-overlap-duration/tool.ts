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
  readonly totalCovered: number;
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
  properties: { overlap: { type: "number" }, totalCovered: { type: "number" } },
  required: ["overlap", "totalCovered"],
} as const;
/** Intersect supplied half-open caption windows without judging caption accessibility or quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStart, firstEnd, secondStart, secondEnd } = request;
  const compute = (): Output => {
    H.domain(firstStart <= firstEnd && secondStart <= secondEnd);
    return {
      overlap: Math.max(
        0,
        Math.min(firstEnd, secondEnd) - Math.max(firstStart, secondStart),
      ),
      totalCovered:
        firstEnd -
        firstStart +
        secondEnd -
        secondStart -
        Math.max(
          0,
          Math.min(firstEnd, secondEnd) - Math.max(firstStart, secondStart),
        ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstStart: 0, firstEnd: 10, secondStart: 8, secondEnd: 15 },
  output: { overlap: 2, totalCovered: 15 },
} satisfies ToolExample<Input, Output>;
export const captionOverlapDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "disability-studies/caption-overlap-duration",
    title: "Caption Overlap Duration Tool",
    description:
      "Intersect supplied half-open caption windows without judging caption accessibility or quality.",
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
        totalCovered: { type: "number" },
      },
      required: ["overlap", "totalCovered"],
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
          id: "totalCovered",
          label: "Total Covered",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = captionOverlapDurationTool.execute;
export default captionOverlapDurationTool;
