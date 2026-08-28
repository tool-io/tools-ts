import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InstrumentationAmplifierGainInput = {
  readonly rGainOhms: number;
};

export type InstrumentationAmplifierGainOutput = {
  readonly instrumentationGain: number;
};

export const instrumentationAmplifierGainExample = {
  input: { rGainOhms: 1000 },
  output: { instrumentationGain: 50.4 },
} satisfies ToolExample<
  InstrumentationAmplifierGainInput,
  InstrumentationAmplifierGainOutput
>;

export const calculateInstrumentationAmplifierGain = (
  input: InstrumentationAmplifierGainInput,
): InstrumentationAmplifierGainOutput => {
  if (!(input.rGainOhms > 0))
    simpleError(
      "rGainOhms",
      "Gain resistor must be positive.",
      "invalid_rg_ohms",
    );
  return { instrumentationGain: 1 + 49400 / input.rGainOhms };
};

export const instrumentationAmplifierGainTool = createSimpleTool({
  calculate: (input) =>
    calculateInstrumentationAmplifierGain(
      input as unknown as InstrumentationAmplifierGainInput,
    ),
  description:
    "Compute the classic INA128-style instrumentation amplifier gain as 1 + 49400 / Rg.",
  id: "electronics/instrumentation-amplifier-gain",
  inputs: [
    { id: "rGainOhms", kind: "number", label: "Gain resistor", unit: "Ω" },
  ],
  outputs: [
    {
      id: "instrumentationGain",
      kind: "number",
      label: "Instrumentation gain",
      unit: "ratio",
    },
  ],
  title: "InAmp Gain",
});
export const runInstrumentationAmplifierGain =
  instrumentationAmplifierGainTool.execute;
export default instrumentationAmplifierGainTool;
