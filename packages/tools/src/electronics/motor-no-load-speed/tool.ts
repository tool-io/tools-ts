import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MotorNoLoadSpeedInput = Readonly<{
  readonly speedConstantRpmPerVolt: number;
  readonly voltageVolts: number;
}>;
export type MotorNoLoadSpeedOutput = Readonly<{
  readonly speedRpm: number;
}>;

export const calculateMotorNoLoadSpeed = (
  x: MotorNoLoadSpeedInput,
): MotorNoLoadSpeedOutput => {
  if (
    !Number.isFinite(x.speedConstantRpmPerVolt) ||
    x.speedConstantRpmPerVolt < 0
  )
    simpleError(
      "speedConstantRpmPerVolt",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.voltageVolts) || x.voltageVolts < 0)
    simpleError("voltageVolts", "Provide a finite number at least 0.");
  const speedRpm = x.speedConstantRpmPerVolt * x.voltageVolts;
  if (!Number.isFinite(speedRpm))
    simpleError(
      "speedRpm",
      "Inputs produce an undefined or non-finite result.",
    );
  return { speedRpm: Object.is(speedRpm, -0) ? 0 : speedRpm };
};

export const example = {
  input: { speedConstantRpmPerVolt: 1000, voltageVolts: 12 },
  output: { speedRpm: 12000 },
} satisfies ToolExample<MotorNoLoadSpeedInput, MotorNoLoadSpeedOutput>;

export const tool = createSimpleTool({
  id: "electronics/motor-no-load-speed",
  title: "Motor No Load Speed",
  description:
    "Ideal no-load rotational speed from motor speed constant and applied voltage; ignores friction and no-load current drop.",
  inputs: [
    {
      id: "speedConstantRpmPerVolt",
      kind: "number",
      label: "Speed Constant Rpm Per Volt",
      unit: "rpm/V",
      minimum: 0,
    },
    {
      id: "voltageVolts",
      kind: "number",
      label: "Voltage Volts",
      unit: "V",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "speedRpm", kind: "number", label: "Speed Rpm", unit: "rpm" },
  ],
  calculate: (input) =>
    calculateMotorNoLoadSpeed({
      speedConstantRpmPerVolt: input.speedConstantRpmPerVolt as number,
      voltageVolts: input.voltageVolts as number,
    }),
});
export const motorNoLoadSpeedTool = tool;
export const runMotorNoLoadSpeed = tool.execute;
export default tool;
