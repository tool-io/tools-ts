import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NcoFrequencyResolutionInput = Readonly<{
  readonly clockHertz: number;
  readonly accumulatorBits: number;
}>;
export type NcoFrequencyResolutionOutput = Readonly<{
  readonly resolutionHertz: number;
}>;

export const calculateNcoFrequencyResolution = (
  x: NcoFrequencyResolutionInput,
): NcoFrequencyResolutionOutput => {
  if (!Number.isFinite(x.clockHertz) || x.clockHertz < 0)
    simpleError("clockHertz", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.accumulatorBits) ||
    !Number.isSafeInteger(x.accumulatorBits) ||
    x.accumulatorBits < 0
  )
    simpleError("accumulatorBits", "Provide a safe integer at least 0.");
  if (
    !Number.isSafeInteger(x.accumulatorBits) ||
    x.accumulatorBits < 1 ||
    x.accumulatorBits > 52
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const resolutionHertz = x.clockHertz / 2 ** x.accumulatorBits;
  if (!Number.isFinite(resolutionHertz))
    simpleError(
      "resolutionHertz",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    resolutionHertz: Object.is(resolutionHertz, -0) ? 0 : resolutionHertz,
  };
};

export const example = {
  input: { clockHertz: 100000000, accumulatorBits: 32 },
  output: { resolutionHertz: 0.023283064365386963 },
} satisfies ToolExample<
  NcoFrequencyResolutionInput,
  NcoFrequencyResolutionOutput
>;

export const tool = createSimpleTool({
  id: "electronics/nco-frequency-resolution",
  title: "NCO Frequency Resolution",
  description:
    "Numerically controlled oscillator frequency step for a given clock and phase accumulator width.",
  inputs: [
    {
      id: "clockHertz",
      kind: "number",
      label: "Clock Hertz",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "accumulatorBits",
      kind: "integer",
      label: "Accumulator Bits",
      unit: "bits",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "resolutionHertz",
      kind: "number",
      label: "Resolution Hertz",
      unit: "Hz",
    },
  ],
  calculate: (input) =>
    calculateNcoFrequencyResolution({
      clockHertz: input.clockHertz as number,
      accumulatorBits: input.accumulatorBits as number,
    }),
});
export const ncoFrequencyResolutionTool = tool;
export const runNcoFrequencyResolution = tool.execute;
export default tool;
