import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReamingTimeInput = Readonly<{
  readonly cutLengthMillimeters: number;
  readonly feedMillimetersPerRevolution: number;
  readonly speedRpm: number;
}>;
export type ReamingTimeOutput = Readonly<{
  readonly timeMinutes: number;
}>;

export const calculateReamingTime = (
  x: ReamingTimeInput,
): ReamingTimeOutput => {
  if (!Number.isFinite(x.cutLengthMillimeters) || x.cutLengthMillimeters < 0)
    simpleError("cutLengthMillimeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.feedMillimetersPerRevolution) ||
    x.feedMillimetersPerRevolution < 0
  )
    simpleError(
      "feedMillimetersPerRevolution",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.speedRpm) || x.speedRpm < 0)
    simpleError("speedRpm", "Provide a finite number at least 0.");
  const timeMinutes =
    x.cutLengthMillimeters / (x.feedMillimetersPerRevolution * x.speedRpm);
  if (!Number.isFinite(timeMinutes))
    simpleError(
      "timeMinutes",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { timeMinutes: Object.is(timeMinutes, -0) ? 0 : timeMinutes };
};

export const example = {
  input: {
    cutLengthMillimeters: 20,
    feedMillimetersPerRevolution: 0.2,
    speedRpm: 500,
  },
  output: { timeMinutes: 0.2 },
} satisfies ToolExample<ReamingTimeInput, ReamingTimeOutput>;

export const tool = createSimpleTool({
  id: "engineering/reaming-time",
  title: "Reaming Time",
  description:
    "Ideal straight reaming feed time from cut length, feed per revolution and spindle speed; excludes tool changes.",
  inputs: [
    {
      id: "cutLengthMillimeters",
      kind: "number",
      label: "Cut Length Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "feedMillimetersPerRevolution",
      kind: "number",
      label: "Feed Millimeters Per Revolution",
      unit: "mm/rev",
      minimum: 0,
    },
    {
      id: "speedRpm",
      kind: "number",
      label: "Speed Rpm",
      unit: "rpm",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "timeMinutes", kind: "number", label: "Time Minutes", unit: "min" },
  ],
  calculate: (input) =>
    calculateReamingTime({
      cutLengthMillimeters: input.cutLengthMillimeters as number,
      feedMillimetersPerRevolution:
        input.feedMillimetersPerRevolution as number,
      speedRpm: input.speedRpm as number,
    }),
});
export const reamingTimeTool = tool;
export const runReamingTime = tool.execute;
export default tool;
