import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly segmentStart: number;
  readonly segmentEnd: number;
  readonly paused: number;
};
export type Output = {
  readonly elapsed: number;
  readonly activeDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    segmentStart: { type: "number" },
    segmentEnd: { type: "number" },
    paused: { type: "number", minimum: 0 },
  },
  required: ["segmentStart", "segmentEnd", "paused"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number" },
    activeDuration: { type: "number" },
  },
  required: ["elapsed", "activeDuration"],
} as const;
/** Timing of a supplied research recording segment, without evaluating a procedure or recommending durations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { segmentStart, segmentEnd, paused } = request;
  const compute = (): Output => {
    H.domain(
      segmentStart <= segmentEnd &&
        paused >= 0 &&
        paused <= segmentEnd - segmentStart,
    );
    return {
      elapsed: segmentEnd - segmentStart,
      activeDuration: segmentEnd - segmentStart - paused,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { segmentStart: 10, segmentEnd: 50, paused: 5 },
  output: { elapsed: 40, activeDuration: 35 },
} satisfies ToolExample<Input, Output>;
export const researchEndoscopySegmentTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gastroenterology/research-endoscopy-segment-time",
    title: "Research Endoscopy Segment Time Tool",
    description:
      "Timing of a supplied research recording segment, without evaluating a procedure or recommending durations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        segmentStart: { type: "number" },
        segmentEnd: { type: "number" },
        paused: { type: "number", minimum: 0 },
      },
      required: ["segmentStart", "segmentEnd", "paused"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number" },
        activeDuration: { type: "number" },
      },
      required: ["elapsed", "activeDuration"],
    },
    ports: {
      inputs: [
        {
          id: "segmentStart",
          label: "Segment Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "segmentEnd",
          label: "Segment End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "paused",
          label: "Paused",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        {
          id: "activeDuration",
          label: "Active Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchEndoscopySegmentTimeTool.execute;
export default researchEndoscopySegmentTimeTool;
