import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RfidReadRangeInput = Readonly<{
  readonly frequencyHz: number;
  readonly readerPowerW: number;
  readonly readerGainLinear: number;
  readonly tagGainLinear: number;
  readonly tagActivationPowerW: number;
}>;
export type RfidReadRangeOutput = Readonly<{ rangeMeters: number }>;

export const calculateRfidReadRange = (
  i: RfidReadRangeInput,
): RfidReadRangeOutput => {
  const direct =
    (299792458 / (4 * Math.PI * i.frequencyHz)) *
    Math.sqrt(
      (i.readerPowerW * i.readerGainLinear * i.tagGainLinear) /
        i.tagActivationPowerW,
    );
  const value =
    direct > 0 && Number.isFinite(direct)
      ? direct
      : Math.exp(
          Math.log(299792458) -
            Math.log(4 * Math.PI) -
            Math.log(i.frequencyHz) +
            (Math.log(i.readerPowerW) +
              Math.log(i.readerGainLinear) +
              Math.log(i.tagGainLinear) -
              Math.log(i.tagActivationPowerW)) /
              2,
        );
  if (!Number.isFinite(value))
    simpleError("rangeMeters", "The inputs produce a non-finite result.");
  return { rangeMeters: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    frequencyHz: 915000000,
    readerPowerW: 1,
    readerGainLinear: 4,
    tagGainLinear: 1.5,
    tagActivationPowerW: 0.00001,
  },
  output: { rangeMeters: 20.196000372384756 },
} satisfies ToolExample<RfidReadRangeInput, RfidReadRangeOutput>;

export const tool = createSimpleTool({
  id: "electronics/rfid-read-range",
  title: "RFID Read Range",
  description:
    "Estimate free-space RFID forward-link range by the Friis equation from frequency, reader transmitted power, linear antenna gains, and tag activation power; reverse-link and regulatory limits are excluded.",
  inputs: [
    {
      id: "frequencyHz",
      kind: "number",
      label: "Frequency (Hz)",
      unit: "Hz",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "readerPowerW",
      kind: "number",
      label: "Reader Power (W)",
      unit: "W",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "readerGainLinear",
      kind: "number",
      label: "Reader Gain Linear",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "tagGainLinear",
      kind: "number",
      label: "Tag Gain Linear",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "tagActivationPowerW",
      kind: "number",
      label: "Tag Activation Power (W)",
      unit: "W",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "rangeMeters", kind: "number", label: "Range (m)", unit: "m" },
  ],
  calculate: (input) =>
    calculateRfidReadRange({
      frequencyHz: input.frequencyHz as number,
      readerPowerW: input.readerPowerW as number,
      readerGainLinear: input.readerGainLinear as number,
      tagGainLinear: input.tagGainLinear as number,
      tagActivationPowerW: input.tagActivationPowerW as number,
    }),
});
export const rfidReadRangeTool = tool;
export const runRfidReadRange = tool.execute;
export default tool;
