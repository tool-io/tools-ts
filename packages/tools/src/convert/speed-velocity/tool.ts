import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const factors: Readonly<Record<string, number>> = {
  "m/s": 1,
  "km/h": 1 / 3.6,
  mph: 0.44704,
  knot: 1852 / 3600,
};
const units = ["m/s", "km/h", "mph", "knot", "Mach"] as const;
export const example = {
  input: {
    fromUnit: "knot",
    speedOfSoundMetersPerSecond: 340.29,
    toUnit: "m/s",
    value: 1,
  },
  output: { unit: "m/s", value: 1852 / 3600 },
} satisfies ToolExample<
  {
    readonly fromUnit: string;
    readonly speedOfSoundMetersPerSecond: number;
    readonly toUnit: string;
    readonly value: number;
  },
  { readonly unit: string; readonly value: number }
>;
export const tool = createSimpleTool({
  id: "convert/speed-velocity",
  title: "Speed and Velocity Converter",
  description:
    "Convert metres per second, kilometres per hour, miles per hour, knots, and Mach number. Mach conversion uses an explicit speed of sound; the default 340.29 m/s is an illustrative air value, not a universal constant.",
  inputs: [
    { id: "value", kind: "number", label: "Value" },
    { id: "fromUnit", kind: "string", label: "From unit", enum: units },
    { id: "toUnit", kind: "string", label: "To unit", enum: units },
    {
      id: "speedOfSoundMetersPerSecond",
      kind: "number",
      label: "Speed of sound (m/s)",
      default: 340.29,
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "value", kind: "number", label: "Converted value" },
    { id: "unit", kind: "string", label: "Unit", enum: units },
  ],
  calculate: (input) => {
    const from = input.fromUnit as string;
    const to = input.toUnit as string;
    const sound = input.speedOfSoundMetersPerSecond as number;
    const fromFactor = from === "Mach" ? sound : factors[from];
    const toFactor = to === "Mach" ? sound : factors[to];
    if (fromFactor === undefined || toFactor === undefined)
      simpleError("fromUnit", "Unsupported speed unit.");
    const value = ((input.value as number) * fromFactor) / toFactor;
    if (!Number.isFinite(value))
      simpleError("value", "Conversion overflows the finite number range.");
    return { unit: to, value };
  },
});
export type SpeedVelocityInput = Readonly<typeof example.input>;
export type SpeedVelocityOutput = Readonly<typeof example.output>;
export const speedVelocityTool = tool;
export const runSpeedVelocity = tool.execute;
export default tool;
