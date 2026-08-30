import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CuttingSpeedInput = Readonly<{
  readonly diameterMillimeters: number;
  readonly speedRpm: number;
}>;
export type CuttingSpeedOutput = Readonly<{
  readonly metersPerMinute: number;
}>;

export const calculateCuttingSpeed = (
  x: CuttingSpeedInput,
): CuttingSpeedOutput => {
  if (!Number.isFinite(x.diameterMillimeters) || x.diameterMillimeters < 0)
    simpleError("diameterMillimeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.speedRpm) || x.speedRpm < 0)
    simpleError("speedRpm", "Provide a finite number at least 0.");
  const metersPerMinute = (Math.PI * x.diameterMillimeters * x.speedRpm) / 1000;
  if (!Number.isFinite(metersPerMinute))
    simpleError(
      "metersPerMinute",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    metersPerMinute: Object.is(metersPerMinute, -0) ? 0 : metersPerMinute,
  };
};

export const example = {
  input: { diameterMillimeters: 10, speedRpm: 1000 },
  output: { metersPerMinute: 31.41592653589793 },
} satisfies ToolExample<CuttingSpeedInput, CuttingSpeedOutput>;

export const tool = createSimpleTool({
  id: "engineering/cutting-speed",
  title: "Cutting Speed",
  description:
    "Cutting surface speed in meters per minute from rotating tool or workpiece diameter in millimeters and spindle RPM.",
  inputs: [
    {
      id: "diameterMillimeters",
      kind: "number",
      label: "Diameter Millimeters",
      unit: "mm",
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
    {
      id: "metersPerMinute",
      kind: "number",
      label: "Meters Per Minute",
      unit: "m/min",
    },
  ],
  calculate: (input) =>
    calculateCuttingSpeed({
      diameterMillimeters: input.diameterMillimeters as number,
      speedRpm: input.speedRpm as number,
    }),
});
export const cuttingSpeedTool = tool;
export const runCuttingSpeed = tool.execute;
export default tool;
