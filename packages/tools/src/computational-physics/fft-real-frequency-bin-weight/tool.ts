import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly sampleCount: number; readonly binIndex: number };
export type Output = { readonly oneSidedPowerWeight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleCount: { type: "integer", minimum: 1 },
    binIndex: { type: "integer", minimum: 0 },
  },
  required: ["sampleCount", "binIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { oneSidedPowerWeight: { type: "integer" } },
  required: ["oneSidedPowerWeight"],
} as const;
/** Return the real-FFT one-sided power weight, keeping DC and an even-length Nyquist bin single and interior bins double. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleCount, binIndex } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(sampleCount) &&
        sampleCount >= 1 &&
        sampleCount <= Number.MAX_SAFE_INTEGER,
      "sampleCount",
    ),
      sampleCount);
    (H.domain(
      Number.isSafeInteger(binIndex) &&
        binIndex >= 0 &&
        binIndex <= Math.floor(sampleCount / 2),
      "binIndex",
    ),
      binIndex);
    return {
      oneSidedPowerWeight:
        binIndex === 0 ||
        (sampleCount % 2 === 0 && binIndex === sampleCount / 2)
          ? 1
          : 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleCount: 8, binIndex: 2 },
  output: { oneSidedPowerWeight: 2 },
} satisfies ToolExample<Input, Output>;
export const fftRealFrequencyBinWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["computational-physics", "computational physics", "physics"],
      keywords: ["computational physics", "physics"],
    },
    id: "computational-physics/fft-real-frequency-bin-weight",
    title: "FFT Real Frequency Bin Weight",
    description:
      "Return the real-FFT one-sided power weight, keeping DC and an even-length Nyquist bin single and interior bins double.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleCount: { type: "integer", minimum: 1 },
        binIndex: { type: "integer", minimum: 0 },
      },
      required: ["sampleCount", "binIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { oneSidedPowerWeight: { type: "integer" } },
      required: ["oneSidedPowerWeight"],
    },
    ports: {
      inputs: [
        {
          id: "sampleCount",
          label: "Sample Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "binIndex",
          label: "Bin Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "oneSidedPowerWeight",
          label: "One Sided Power Weight",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = fftRealFrequencyBinWeightTool.execute;
export default fftRealFrequencyBinWeightTool;
