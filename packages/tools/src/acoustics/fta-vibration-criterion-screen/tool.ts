import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly eventFrequency: "frequent" | "occasional" | "infrequent";
  readonly measuredVelocityLevelVdb: number;
}>;
export type Output = Readonly<{
  readonly criterionVdb: number;
  readonly marginVdb: number;
  readonly withinCriterion: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (!Number.isFinite(input.measuredVelocityLevelVdb))
    simpleError(
      "measuredVelocityLevelVdb",
      "Measured level must be finite.",
      "invalid_level",
    );
  const criterionVdb =
    input.eventFrequency === "frequent"
      ? 72
      : input.eventFrequency === "occasional"
        ? 75
        : 80;
  const marginVdb = criterionVdb - input.measuredVelocityLevelVdb;
  if (!Number.isFinite(marginVdb))
    simpleError(
      "measuredVelocityLevelVdb",
      "Criterion margin is out of range.",
      "numeric_overflow",
    );
  return { criterionVdb, marginVdb, withinCriterion: marginVdb >= 0 };
};

export const example = {
  input: { eventFrequency: "frequent", measuredVelocityLevelVdb: 70 },
  output: { criterionVdb: 72, marginVdb: 2, withinCriterion: true },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: { eventFrequency: "infrequent", measuredVelocityLevelVdb: 82 },
  output: { criterionVdb: 80, marginVdb: -2, withinCriterion: false },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      eventFrequency: input.eventFrequency as Input["eventFrequency"],
      measuredVelocityLevelVdb: input.measuredVelocityLevelVdb as number,
    }),
  description:
    "Compare residential maximum vibration velocity level with the FTA Category 2 criterion for frequent, occasional, or infrequent events.",
  id: "acoustics/fta-vibration-criterion-screen",
  inputs: [
    {
      id: "eventFrequency",
      kind: "string",
      label: "FTA event-frequency class",
      enum: ["frequent", "occasional", "infrequent"],
    },
    {
      id: "measuredVelocityLevelVdb",
      kind: "number",
      label: "Measured vibration velocity level",
      unit: "VdB",
    },
  ],
  outputs: [
    {
      id: "criterionVdb",
      kind: "number",
      label: "FTA Category 2 criterion",
      unit: "VdB",
    },
    {
      id: "marginVdb",
      kind: "number",
      label: "Margin to criterion",
      unit: "VdB",
    },
    { id: "withinCriterion", kind: "boolean", label: "Within criterion" },
  ],
  title: "FTA Vibration Criterion Screen",
});

export const run = tool.execute;
export default tool;
