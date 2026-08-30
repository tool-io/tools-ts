import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TapeSpeedCmSFromIpsInput = Readonly<{
  readonly inchesPerSecond: number;
}>;
export type TapeSpeedCmSFromIpsOutput = Readonly<{
  readonly centimetersPerSecond: number;
}>;

export const calculateTapeSpeedCmSFromIps = (
  x: TapeSpeedCmSFromIpsInput,
): TapeSpeedCmSFromIpsOutput => {
  if (!Number.isFinite(x.inchesPerSecond) || x.inchesPerSecond < 0)
    simpleError("inchesPerSecond", "Provide a finite nonnegative number.");
  const centimetersPerSecond = 2.54 * x.inchesPerSecond;
  if (!Number.isFinite(centimetersPerSecond))
    simpleError(
      "centimetersPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    centimetersPerSecond: Object.is(centimetersPerSecond, -0)
      ? 0
      : centimetersPerSecond,
  };
};

export const example = {
  input: {
    inchesPerSecond: 15,
  },
  output: { centimetersPerSecond: 38.1 },
} satisfies ToolExample<TapeSpeedCmSFromIpsInput, TapeSpeedCmSFromIpsOutput>;

export const tool = createSimpleTool({
  id: "music/tape-speed-cm-s-from-ips",
  title: "Tape Speed Cm S From Ips",
  description:
    "Tape transport speed in centimetres per second from inches per second.",
  inputs: [
    {
      id: "inchesPerSecond",
      kind: "number",
      label: "Inches Per Second",
      unit: "in/s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "centimetersPerSecond",
      kind: "number",
      label: "Centimeters Per Second",
      unit: "cm/s",
    },
  ],
  calculate: (input) =>
    calculateTapeSpeedCmSFromIps({
      inchesPerSecond: input.inchesPerSecond as number,
    }),
});
export const tapeSpeedCmSFromIpsTool = tool;
export const runTapeSpeedCmSFromIps = tool.execute;
export default tool;
