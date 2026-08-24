import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TranscriptDriftPerHourEstimatorInput = {
  readonly offsetStartSeconds?: number;
  readonly offsetEndSeconds: number;
  readonly elapsedHours: number;
};

export type TranscriptDriftPerHourEstimatorOutput = {
  readonly driftPerHour: number;
  readonly totalDriftSeconds: number;
};

export const calculateTranscriptDriftPerHourEstimator = (
  input: TranscriptDriftPerHourEstimatorInput,
): TranscriptDriftPerHourEstimatorOutput => {
  const elapsedHours = input.elapsedHours;
  if (!Number.isFinite(elapsedHours) || elapsedHours <= 0)
    simpleError(
      "elapsedHours",
      "Elapsed time must be a finite number greater than 0 hours.",
      "invalid_elapsed",
    );
  const offsetStartSeconds = input.offsetStartSeconds ?? 0;
  const totalDriftSeconds = input.offsetEndSeconds - offsetStartSeconds;
  return {
    totalDriftSeconds,
    driftPerHour: totalDriftSeconds / input.elapsedHours,
  };
};

export const transcriptDriftPerHourEstimatorExample = {
  input: { offsetEndSeconds: 4.5, elapsedHours: 3 },
  output: { driftPerHour: 1.5, totalDriftSeconds: 4.5 },
} satisfies ToolExample<
  TranscriptDriftPerHourEstimatorInput,
  TranscriptDriftPerHourEstimatorOutput
>;

export const transcriptDriftPerHourEstimatorTool = createSimpleTool({
  id: "archival-studies/transcript-drift-per-hour-estimator",
  title: "Transcript Sync Offset Drift Seconds per Hour Estimator",
  description:
    "Estimate transcript-to-audio sync drift in seconds per hour from the change in alignment offset over the elapsed interview duration.",
  inputs: [
    {
      default: 0,
      description: "Sync offset in seconds at the reference point.",
      id: "offsetStartSeconds",
      kind: "number",
      label: "Start offset",
    },
    {
      description: "Sync offset in seconds at the later checkpoint.",
      id: "offsetEndSeconds",
      kind: "number",
      label: "End offset",
    },
    {
      description: "Interview playback hours between the two checkpoints.",
      id: "elapsedHours",
      kind: "number",
      label: "Elapsed hours",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Estimated drift in seconds per hour of playback.",
      id: "driftPerHour",
      kind: "number",
      label: "Drift per hour",
    },
    {
      description: "Total offset change between the checkpoints.",
      id: "totalDriftSeconds",
      kind: "number",
      label: "Total drift",
    },
  ],
  calculate: (input) =>
    calculateTranscriptDriftPerHourEstimator({
      elapsedHours: input.elapsedHours as number,
      offsetEndSeconds: input.offsetEndSeconds as number,
      offsetStartSeconds:
        (input.offsetStartSeconds as number | undefined) ?? undefined,
    }),
});

export const runTranscriptDriftPerHourEstimator =
  transcriptDriftPerHourEstimatorTool.execute;
export default transcriptDriftPerHourEstimatorTool;
