import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MachiningTimeLatheInput = Readonly<{
  readonly cutLengthMillimeters: number;
  readonly feedMillimetersPerRevolution: number;
  readonly speedRpm: number;
}>;
export type MachiningTimeLatheOutput = Readonly<{
  readonly timeMinutes: number;
}>;

export const calculateMachiningTimeLathe = (
  x: MachiningTimeLatheInput,
): MachiningTimeLatheOutput => {
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
    cutLengthMillimeters: 100,
    feedMillimetersPerRevolution: 0.2,
    speedRpm: 500,
  },
  output: { timeMinutes: 1 },
} satisfies ToolExample<MachiningTimeLatheInput, MachiningTimeLatheOutput>;

export const tool = createSimpleTool({
  id: "engineering/machining-time-lathe",
  title: "Machining Time Lathe",
  description:
    "Straight turning time from axial cut length, feed per revolution and spindle speed; excludes approach and tool changes.",
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
    calculateMachiningTimeLathe({
      cutLengthMillimeters: input.cutLengthMillimeters as number,
      feedMillimetersPerRevolution:
        input.feedMillimetersPerRevolution as number,
      speedRpm: input.speedRpm as number,
    }),
});
export const machiningTimeLatheTool = tool;
export const runMachiningTimeLathe = tool.execute;
export default tool;
