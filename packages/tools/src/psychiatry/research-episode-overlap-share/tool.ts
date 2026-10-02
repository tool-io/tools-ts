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
  readonly firstShare: number;
  readonly defined: boolean;
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
    firstShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["overlap", "firstShare", "defined"],
} as const;
/** Intersect explicitly annotated research episode intervals without diagnosing an episode. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStart, firstEnd, secondStart, secondEnd } = request;
  const compute = (): Output => {
    H.domain(firstEnd >= firstStart && secondEnd >= secondStart);
    return {
      overlap: Math.max(
        0,
        Math.min(firstEnd, secondEnd) - Math.max(firstStart, secondStart),
      ),
      firstShare:
        firstEnd > firstStart
          ? Math.max(
              0,
              Math.min(firstEnd, secondEnd) - Math.max(firstStart, secondStart),
            ) /
            (firstEnd - firstStart)
          : 0,
      defined: firstEnd > firstStart,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstStart: 10, firstEnd: 20, secondStart: 15, secondEnd: 25 },
  output: { overlap: 5, firstShare: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const researchEpisodeOverlapShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "psychiatry/research-episode-overlap-share",
    title: "Research Episode Overlap Share Tool",
    description:
      "Intersect explicitly annotated research episode intervals without diagnosing an episode.",
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
        firstShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["overlap", "firstShare", "defined"],
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
          id: "firstShare",
          label: "First Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = researchEpisodeOverlapShareTool.execute;
export default researchEpisodeOverlapShareTool;
