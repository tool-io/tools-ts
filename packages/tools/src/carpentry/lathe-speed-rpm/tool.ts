import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LatheSpeedRpmInput = Readonly<{
  readonly surfaceSpeedMPerMinute: number;
  readonly workDiameterMm: number;
}>;
export type LatheSpeedRpmOutput = Readonly<{
  readonly spindleRpm: number;
}>;

export const calculateLatheSpeedRpm = (
  x: LatheSpeedRpmInput,
): LatheSpeedRpmOutput => {
  if (
    !Number.isFinite(x.surfaceSpeedMPerMinute) ||
    x.surfaceSpeedMPerMinute < 0
  )
    simpleError(
      "surfaceSpeedMPerMinute",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.workDiameterMm) || x.workDiameterMm < 0)
    simpleError("workDiameterMm", "Provide a finite number at least 0.");
  if (!(x.workDiameterMm > 0))
    simpleError("workDiameterMm", "Work diameter must be positive.");
  const spindleRpm =
    (1000 * x.surfaceSpeedMPerMinute) / (Math.PI * x.workDiameterMm);
  if (!Number.isFinite(spindleRpm))
    simpleError("spindleRpm", "The inputs produce an invalid result.");
  return { spindleRpm: Object.is(spindleRpm, -0) ? 0 : spindleRpm };
};

export const example = {
  input: { surfaceSpeedMPerMinute: 100, workDiameterMm: 100 },
  output: { spindleRpm: 318.3098861837907 },
} satisfies ToolExample<LatheSpeedRpmInput, LatheSpeedRpmOutput>;

export const tool = createSimpleTool({
  id: "carpentry/lathe-speed-rpm",
  title: "Lathe Speed RPM",
  description:
    "Convert target surface cutting speed and turning diameter into kinematic spindle RPM; this is not a safe-speed recommendation.",
  inputs: [
    {
      id: "surfaceSpeedMPerMinute",
      kind: "number",
      label: "Target surface speed",
      unit: "m/min",
      minimum: 0,
    },
    {
      id: "workDiameterMm",
      kind: "number",
      label: "Work diameter",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "spindleRpm",
      kind: "number",
      label: "Kinematic spindle speed",
      unit: "rpm",
    },
  ],
  calculate: (input) =>
    calculateLatheSpeedRpm({
      surfaceSpeedMPerMinute: input.surfaceSpeedMPerMinute as number,
      workDiameterMm: input.workDiameterMm as number,
    }),
});
export const latheSpeedRpmTool = tool;
export const runLatheSpeedRpm = tool.execute;
export default tool;
