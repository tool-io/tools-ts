import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly start: number;
  readonly end: number;
  readonly stoppedDurations: readonly number[];
  readonly overlap: number;
};
export type Output = {
  readonly elapsed: number;
  readonly stoppedUnion: number;
  readonly active: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "number" },
    end: { type: "number" },
    stoppedDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    overlap: { type: "number", minimum: 0 },
  },
  required: ["start", "end", "stoppedDurations", "overlap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number" },
    stoppedUnion: { type: "number" },
    active: { type: "number" },
  },
  required: ["elapsed", "stoppedUnion", "active"],
} as const;
/** Calculate regulatory workflow clock stop duration from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { start, end, stoppedDurations, overlap } = request;
  const compute = (): Output => {
    H.domain(
      end >= start &&
        stoppedDurations.every((x) => x >= 0) &&
        overlap >= 0 &&
        overlap <= stoppedDurations.reduce((a, b) => a + b, 0) &&
        stoppedDurations.reduce((a, b) => a + b, 0) - overlap <= end - start,
    );
    return {
      elapsed: end - start,
      stoppedUnion: stoppedDurations.reduce((a, b) => a + b, 0) - overlap,
      active:
        end - start - stoppedDurations.reduce((a, b) => a + b, 0) + overlap,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { start: 100, end: 150, stoppedDurations: [10, 5], overlap: 2 },
  output: { elapsed: 50, stoppedUnion: 13, active: 37 },
} satisfies ToolExample<Input, Output>;
export const regulatoryWorkflowClockStopDurationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "regulatory-affairs/regulatory-workflow-clock-stop-duration",
      title: "Regulatory Workflow Clock Stop Duration Tool",
      description:
        "Calculate regulatory workflow clock stop duration from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          start: { type: "number" },
          end: { type: "number" },
          stoppedDurations: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          overlap: { type: "number", minimum: 0 },
        },
        required: ["start", "end", "stoppedDurations", "overlap"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          elapsed: { type: "number" },
          stoppedUnion: { type: "number" },
          active: { type: "number" },
        },
        required: ["elapsed", "stoppedUnion", "active"],
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
            id: "stoppedDurations",
            label: "Stopped Durations",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "overlap",
            label: "Overlap",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
          {
            id: "stoppedUnion",
            label: "Stopped Union",
            valueType: { type: "number" },
          },
          { id: "active", label: "Active", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = regulatoryWorkflowClockStopDurationTool.execute;
export default regulatoryWorkflowClockStopDurationTool;
