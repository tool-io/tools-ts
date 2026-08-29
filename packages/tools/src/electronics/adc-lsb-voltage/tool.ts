import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { fullScaleSpanV: 4.096, bits: 12 },
  output: { lsbVoltageV: 0.001 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/adc-lsb-voltage",
  title: "ADC LSB Voltage",
  description:
    "Calculate one ideal ADC code width as full-scale input span divided by 2^N. Full-scale span is the high-to-low range, not necessarily the reference voltage for every ADC topology.",
  inputs: [
    {
      id: "fullScaleSpanV",
      kind: "number",
      label: "Full-scale input span (V)",
      minimum: Number.MIN_VALUE,
    },
    { id: "bits", kind: "integer", label: "Resolution (bits)", minimum: 1 },
  ],
  outputs: [{ id: "lsbVoltageV", kind: "number", label: "Lsb Voltage V" }],
  calculate: (input) => {
    const i = input as Record<string, number>;
    if (i.bits > 52)
      simpleError(
        "bits",
        "Resolution above 52 bits exceeds useful JavaScript floating precision.",
      );
    const output = { lsbVoltageV: i.fullScaleSpanV / Math.pow(2, i.bits) };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type AdcLsbVoltageInput = Readonly<typeof example.input>;
export type AdcLsbVoltageOutput = Readonly<typeof example.output>;
export const adcLsbVoltageTool = tool;
export const runAdcLsbVoltage = tool.execute;
export default tool;
