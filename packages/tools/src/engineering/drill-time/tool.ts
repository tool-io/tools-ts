import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DrillTimeInput = Readonly<{
  readonly holeDepthMillimeters: number;
  readonly approachMillimeters: number;
  readonly feedMillimetersPerRevolution: number;
  readonly speedRpm: number;
}>;
export type DrillTimeOutput = Readonly<{
  readonly timeMinutes: number;
}>;

export const calculateDrillTime = (x: DrillTimeInput): DrillTimeOutput => {
  if (!Number.isFinite(x.holeDepthMillimeters) || x.holeDepthMillimeters < 0)
    simpleError("holeDepthMillimeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.approachMillimeters) || x.approachMillimeters < 0)
    simpleError("approachMillimeters", "Provide a finite number at least 0.");
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
    (x.holeDepthMillimeters + x.approachMillimeters) /
    (x.feedMillimetersPerRevolution * x.speedRpm);
  if (!Number.isFinite(timeMinutes))
    simpleError(
      "timeMinutes",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { timeMinutes: Object.is(timeMinutes, -0) ? 0 : timeMinutes };
};

export const example = {
  input: {
    holeDepthMillimeters: 20,
    approachMillimeters: 2,
    feedMillimetersPerRevolution: 0.2,
    speedRpm: 500,
  },
  output: { timeMinutes: 0.22 },
} satisfies ToolExample<DrillTimeInput, DrillTimeOutput>;

export const tool = createSimpleTool({
  id: "engineering/drill-time",
  title: "Drill Time",
  description:
    "Ideal drilling feed time from hole depth plus approach, feed per revolution and spindle speed; excludes tool changes.",
  inputs: [
    {
      id: "holeDepthMillimeters",
      kind: "number",
      label: "Hole Depth Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "approachMillimeters",
      kind: "number",
      label: "Approach Millimeters",
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
    calculateDrillTime({
      holeDepthMillimeters: input.holeDepthMillimeters as number,
      approachMillimeters: input.approachMillimeters as number,
      feedMillimetersPerRevolution:
        input.feedMillimetersPerRevolution as number,
      speedRpm: input.speedRpm as number,
    }),
});
export const drillTimeTool = tool;
export const runDrillTime = tool.execute;
export default tool;
