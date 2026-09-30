import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStart: number;
  readonly firstEnd: number;
  readonly secondStart: number;
  readonly secondEnd: number;
};
export type Output = { readonly overlapCount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStart: { type: "integer", minimum: 1 },
    firstEnd: { type: "integer" },
    secondStart: { type: "integer", minimum: 1 },
    secondEnd: { type: "integer" },
  },
  required: ["firstStart", "firstEnd", "secondStart", "secondEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overlapCount: { type: "integer" } },
  required: ["overlapCount"],
} as const;
/** Intersect inclusive verse-number ranges within one explicitly matched public text/chapter. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStart, firstEnd, secondStart, secondEnd } = request;
  const compute = (): Output => {
    H.integer(firstStart, 1);
    H.integer(firstEnd, firstStart);
    H.integer(secondStart, 1);
    H.integer(secondEnd, secondStart);
    return {
      overlapCount: Math.max(
        0,
        Math.min(firstEnd, secondEnd) - Math.max(firstStart, secondStart) + 1,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstStart: 2, firstEnd: 6, secondStart: 5, secondEnd: 8 },
  output: { overlapCount: 2 },
} satisfies ToolExample<Input, Output>;
export const publicAyahRangeOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "islamic-studies/public-ayah-range-overlap",
    title: "Public Ayah Range Overlap Tool",
    description:
      "Intersect inclusive verse-number ranges within one explicitly matched public text/chapter.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstStart: { type: "integer", minimum: 1 },
        firstEnd: { type: "integer" },
        secondStart: { type: "integer", minimum: 1 },
        secondEnd: { type: "integer" },
      },
      required: ["firstStart", "firstEnd", "secondStart", "secondEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { overlapCount: { type: "integer" } },
      required: ["overlapCount"],
    },
    ports: {
      inputs: [
        {
          id: "firstStart",
          label: "First Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstEnd",
          label: "First End",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondStart",
          label: "Second Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondEnd",
          label: "Second End",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "overlapCount",
          label: "Overlap Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicAyahRangeOverlapTool.execute;
export default publicAyahRangeOverlapTool;
