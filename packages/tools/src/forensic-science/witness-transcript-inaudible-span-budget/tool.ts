import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordingSeconds: number;
  readonly inaudibleSeconds: number;
  readonly untranscribedSeconds: number;
};
export type Output = {
  readonly audibleTranscribedSeconds: number;
  readonly inaudibleFraction: number;
  readonly coveredFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordingSeconds: { type: "number", exclusiveMinimum: 0 },
    inaudibleSeconds: { type: "number", minimum: 0 },
    untranscribedSeconds: { type: "number", minimum: 0 },
  },
  required: ["recordingSeconds", "inaudibleSeconds", "untranscribedSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    audibleTranscribedSeconds: { type: "number" },
    inaudibleFraction: { type: "number" },
    coveredFraction: { type: "number" },
  },
  required: [
    "audibleTranscribedSeconds",
    "inaudibleFraction",
    "coveredFraction",
  ],
} as const;
/** Disjoint inaudible and untranscribed duration accounting; no transcript reliability or testimony assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordingSeconds, inaudibleSeconds, untranscribedSeconds } = request;
  const compute = (): Output => {
    H.positive(recordingSeconds);
    H.domain(
      inaudibleSeconds >= 0 &&
        untranscribedSeconds >= 0 &&
        inaudibleSeconds + untranscribedSeconds <= recordingSeconds,
    );
    return {
      audibleTranscribedSeconds:
        recordingSeconds - inaudibleSeconds - untranscribedSeconds,
      inaudibleFraction: inaudibleSeconds / recordingSeconds,
      coveredFraction:
        (recordingSeconds - untranscribedSeconds) / recordingSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordingSeconds: 600,
    inaudibleSeconds: 30,
    untranscribedSeconds: 60,
  },
  output: {
    audibleTranscribedSeconds: 510,
    inaudibleFraction: 0.05,
    coveredFraction: 0.9,
  },
} satisfies ToolExample<Input, Output>;
export const witnessTranscriptInaudibleSpanBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "forensic-science/witness-transcript-inaudible-span-budget",
      title: "Witness Transcript Inaudible Span Budget Tool",
      description:
        "Disjoint inaudible and untranscribed duration accounting; no transcript reliability or testimony assessment.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordingSeconds: { type: "number", exclusiveMinimum: 0 },
          inaudibleSeconds: { type: "number", minimum: 0 },
          untranscribedSeconds: { type: "number", minimum: 0 },
        },
        required: [
          "recordingSeconds",
          "inaudibleSeconds",
          "untranscribedSeconds",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          audibleTranscribedSeconds: { type: "number" },
          inaudibleFraction: { type: "number" },
          coveredFraction: { type: "number" },
        },
        required: [
          "audibleTranscribedSeconds",
          "inaudibleFraction",
          "coveredFraction",
        ],
      },
      ports: {
        inputs: [
          {
            id: "recordingSeconds",
            label: "Recording Seconds",
            required: true,
            valueType: { type: "number", unit: "s" },
          },
          {
            id: "inaudibleSeconds",
            label: "Inaudible Seconds",
            required: true,
            valueType: { type: "number", unit: "s" },
          },
          {
            id: "untranscribedSeconds",
            label: "Untranscribed Seconds",
            required: true,
            valueType: { type: "number", unit: "s" },
          },
        ],
        outputs: [
          {
            id: "audibleTranscribedSeconds",
            label: "Audible Transcribed Seconds",
            valueType: { type: "number", unit: "s" },
          },
          {
            id: "inaudibleFraction",
            label: "Inaudible Fraction",
            valueType: { type: "number" },
          },
          {
            id: "coveredFraction",
            label: "Covered Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = witnessTranscriptInaudibleSpanBudgetTool.execute;
export default witnessTranscriptInaudibleSpanBudgetTool;
