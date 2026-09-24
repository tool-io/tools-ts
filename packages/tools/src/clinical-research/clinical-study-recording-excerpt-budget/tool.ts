import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly start: number;
  readonly end: number;
  readonly playbackRate: number;
  readonly allotted: number;
  readonly excluded: number;
};
export type Output = {
  readonly sourceDuration: number;
  readonly playbackDuration: number;
  readonly remainingBudget: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "number" },
    end: { type: "number" },
    playbackRate: { type: "number", exclusiveMinimum: 0 },
    allotted: { type: "number", minimum: 0 },
    excluded: { type: "number", minimum: 0 },
  },
  required: ["start", "end", "playbackRate", "allotted", "excluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceDuration: { type: "number" },
    playbackDuration: { type: "number" },
    remainingBudget: { type: "number" },
    fits: { type: "boolean" },
  },
  required: ["sourceDuration", "playbackDuration", "remainingBudget", "fits"],
} as const;
/** Calculate clinical study recording excerpt budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { start, end, playbackRate, allotted, excluded } = request;
  const compute = (): Output => {
    H.positive(playbackRate);
    H.domain(
      end >= start && excluded >= 0 && excluded <= end - start && allotted >= 0,
    );
    return {
      sourceDuration: end - start - excluded,
      playbackDuration: (end - start - excluded) / playbackRate,
      remainingBudget: allotted - (end - start - excluded) / playbackRate,
      fits: (end - start - excluded) / playbackRate <= allotted,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { start: 10, end: 70, playbackRate: 2, allotted: 25, excluded: 20 },
  output: {
    sourceDuration: 40,
    playbackDuration: 20,
    remainingBudget: 5,
    fits: true,
  },
} satisfies ToolExample<Input, Output>;
export const clinicalStudyRecordingExcerptBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "clinical-research/clinical-study-recording-excerpt-budget",
      title: "Clinical Study Recording Excerpt Budget Tool",
      description:
        "Calculate clinical study recording excerpt budget from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          start: { type: "number" },
          end: { type: "number" },
          playbackRate: { type: "number", exclusiveMinimum: 0 },
          allotted: { type: "number", minimum: 0 },
          excluded: { type: "number", minimum: 0 },
        },
        required: ["start", "end", "playbackRate", "allotted", "excluded"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceDuration: { type: "number" },
          playbackDuration: { type: "number" },
          remainingBudget: { type: "number" },
          fits: { type: "boolean" },
        },
        required: [
          "sourceDuration",
          "playbackDuration",
          "remainingBudget",
          "fits",
        ],
      },
      ports: {
        inputs: [
          {
            id: "start",
            label: "Start",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "end",
            label: "End",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "playbackRate",
            label: "Playback Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "allotted",
            label: "Allotted",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "excluded",
            label: "Excluded",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "sourceDuration",
            label: "Source Duration",
            valueType: { type: "number" },
          },
          {
            id: "playbackDuration",
            label: "Playback Duration",
            valueType: { type: "number" },
          },
          {
            id: "remainingBudget",
            label: "Remaining Budget",
            valueType: { type: "number" },
          },
          { id: "fits", label: "Fits", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = clinicalStudyRecordingExcerptBudgetTool.execute;
export default clinicalStudyRecordingExcerptBudgetTool;
