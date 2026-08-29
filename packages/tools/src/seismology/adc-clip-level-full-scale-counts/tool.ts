import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const adcClipLevelFullScaleCountsExample = {
  input: { bitDepth: 24, fullScaleVPp: 40 },
  output: {
    lsbMicroVolts: 2.384185791015625,
    clipVoltageV: 19.99999761581421,
    maxCounts: 8388607,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const adcClipLevelFullScaleCountsTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ bitDepth, fullScaleVPp }) => {
      if (!(fullScaleVPp > 0))
        simpleError("fullScaleVPp", "Full-scale voltage must be positive.");
      const lsbV = fullScaleVPp / 2 ** bitDepth;
      const maxCounts = 2 ** (bitDepth - 1) - 1;
      return {
        lsbMicroVolts: lsbV * 1e6,
        clipVoltageV: maxCounts * lsbV,
        maxCounts,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Digitizer LSB size and clip voltage from bit depth and full-scale range.",
  id: "seismology/adc-clip-level-full-scale-counts",
  inputs: [
    {
      minimum: 1,
      maximum: 52,
      description: "Converter resolution.",
      id: "bitDepth",
      kind: "integer",
      label: "N",
    },
    {
      minimum: 0,
      description: "Peak-to-peak full-scale voltage.",
      id: "fullScaleVPp",
      kind: "number",
      label: "FS",
      unit: "V",
    },
  ],
  outputs: [
    {
      description: "Least-significant-bit weight.",
      id: "lsbMicroVolts",
      kind: "number",
      label: "LSB",
      unit: "µV",
    },
    {
      description: "Positive rail clip level.",
      id: "clipVoltageV",
      kind: "number",
      label: "Clip",
      unit: "V",
    },
    {
      description: "Maximum positive code.",
      id: "maxCounts",
      kind: "number",
      label: "Counts",
    },
  ],
  title: "ADC Clip Level Full Scale Counts Calculator",
});
export const runAdcClipLevelFullScaleCounts =
  adcClipLevelFullScaleCountsTool.execute;
export { adcClipLevelFullScaleCountsExample as example };
export default adcClipLevelFullScaleCountsTool;
