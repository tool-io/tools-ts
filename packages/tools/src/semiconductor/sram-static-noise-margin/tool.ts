import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SramStaticNoiseMarginInput = {
  readonly inputHighMinVolts: number;
  readonly inputLowMaxVolts: number;
  readonly outputHighMinVolts: number;
  readonly outputLowMaxVolts: number;
};

export type SramStaticNoiseMarginOutput = {
  readonly highNoiseMarginVolts: number;
  readonly lowNoiseMarginVolts: number;
  readonly staticNoiseMarginVolts: number;
};

export const sramStaticNoiseMarginExample = {
  input: {
    inputHighMinVolts: 0.8,
    inputLowMaxVolts: 0.4,
    outputHighMinVolts: 1.1,
    outputLowMaxVolts: 0.1,
  },
  output: {
    highNoiseMarginVolts: 0.30000000000000004,
    lowNoiseMarginVolts: 0.30000000000000004,
    staticNoiseMarginVolts: 0.30000000000000004,
  },
} satisfies ToolExample<
  SramStaticNoiseMarginInput,
  SramStaticNoiseMarginOutput
>;

export const sramStaticNoiseMarginTool = createSimpleTool({
  id: "semiconductor/sram-static-noise-margin",
  title: "SRAM Static Noise Margin Calculator",
  description:
    "Calculate the limiting static noise margin from the low and high input and output levels of an SRAM inverter voltage-transfer characteristic.",
  inputs: [
    {
      description: "Maximum input voltage still interpreted as logic low.",
      id: "inputLowMaxVolts",
      kind: "number",
      label: "Maximum low input",
      unit: "V",
    },
    {
      description: "Maximum output voltage guaranteed for logic low.",
      id: "outputLowMaxVolts",
      kind: "number",
      label: "Maximum low output",
      unit: "V",
    },
    {
      description: "Minimum output voltage guaranteed for logic high.",
      id: "outputHighMinVolts",
      kind: "number",
      label: "Minimum high output",
      unit: "V",
    },
    {
      description: "Minimum input voltage interpreted as logic high.",
      id: "inputHighMinVolts",
      kind: "number",
      label: "Minimum high input",
      unit: "V",
    },
  ],
  outputs: [
    {
      id: "lowNoiseMarginVolts",
      kind: "number",
      label: "Low noise margin",
      unit: "V",
    },
    {
      id: "highNoiseMarginVolts",
      kind: "number",
      label: "High noise margin",
      unit: "V",
    },
    {
      description: "Smaller of the low and high static noise margins.",
      id: "staticNoiseMarginVolts",
      kind: "number",
      label: "Static noise margin",
      unit: "V",
    },
  ],
  calculate: (input) => {
    const lowNoiseMarginVolts =
      (input.inputLowMaxVolts as number) - (input.outputLowMaxVolts as number);
    const highNoiseMarginVolts =
      (input.outputHighMinVolts as number) -
      (input.inputHighMinVolts as number);
    if (lowNoiseMarginVolts < 0)
      simpleError(
        "inputLowMaxVolts",
        "Maximum low input must not be below maximum low output.",
        "invalid_low_levels",
      );
    if (highNoiseMarginVolts < 0)
      simpleError(
        "outputHighMinVolts",
        "Minimum high output must not be below minimum high input.",
        "invalid_high_levels",
      );
    return {
      highNoiseMarginVolts,
      lowNoiseMarginVolts,
      staticNoiseMarginVolts: Math.min(
        lowNoiseMarginVolts,
        highNoiseMarginVolts,
      ),
    };
  },
});
export const runSramStaticNoiseMargin = sramStaticNoiseMarginTool.execute;
export default sramStaticNoiseMarginTool;
