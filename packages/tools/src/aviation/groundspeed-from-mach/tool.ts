import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GroundspeedFromMachInput = {
  readonly mach: number;
  readonly oatC: number;
};

export type GroundspeedFromMachOutput = {
  readonly groundSpeedKt: number;
};

/** Speed of sound at ISA sea level in knots. */
const A0_KT = 661.478848;
const T0_K = 288.15;

export const groundspeedFromMachExample = {
  input: { mach: 0.8, oatC: -56.5 },
  output: { groundSpeedKt: 458.8555437690783 },
} satisfies ToolExample<GroundspeedFromMachInput, GroundspeedFromMachOutput>;

export const calculateGroundspeedFromMach = (
  input: GroundspeedFromMachInput,
): GroundspeedFromMachOutput => {
  if (input.mach <= 0)
    simpleError("mach", "The Mach number must be positive.", "invalid_mach");
  const temperatureK = input.oatC + 273.15;
  if (temperatureK <= 0)
    simpleError(
      "oatC",
      "Temperature must be above absolute zero.",
      "invalid_temperature",
    );
  return {
    groundSpeedKt: input.mach * A0_KT * Math.sqrt(temperatureK / T0_K),
  };
};

export const groundspeedFromMachTool = createSimpleTool({
  calculate: (input) =>
    calculateGroundspeedFromMach(input as unknown as GroundspeedFromMachInput),
  description:
    "Compute true ground speed from Mach number and outside air temperature.",
  id: "aviation/groundspeed-from-mach",
  inputs: [
    {
      description: "Mach number.",
      id: "mach",
      kind: "number",
      label: "Mach number",
      minimum: 0,
    },
    {
      description: "Outside air temperature.",
      id: "oatC",
      kind: "number",
      label: "OAT",
      unit: "°C",
    },
  ],
  outputs: [
    {
      description: "True airspeed / ground speed in still air.",
      format: "speed",
      id: "groundSpeedKt",
      kind: "number",
      label: "Ground speed",
      unit: "kt",
    },
  ],
  title: "Groundspeed From Mach Calculator",
});
export const runGroundspeedFromMach = groundspeedFromMachTool.execute;
export default groundspeedFromMachTool;
