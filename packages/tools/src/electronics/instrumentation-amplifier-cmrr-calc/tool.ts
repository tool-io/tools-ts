import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InstrumentationAmplifierCmrrCalcInput = Readonly<{
  readonly differentialGain: number;
  readonly commonModeGain: number;
}>;
export type InstrumentationAmplifierCmrrCalcOutput = Readonly<{
  readonly cmrrDecibels: number;
}>;

export const calculateInstrumentationAmplifierCmrrCalc = (
  x: InstrumentationAmplifierCmrrCalcInput,
): InstrumentationAmplifierCmrrCalcOutput => {
  if (!Number.isFinite(x.differentialGain) || x.differentialGain < 0)
    simpleError("differentialGain", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.commonModeGain) || x.commonModeGain < 0)
    simpleError("commonModeGain", "Provide a finite number at least 0.");
  const cmrrDecibels = 20 * Math.log10(x.differentialGain / x.commonModeGain);
  if (!Number.isFinite(cmrrDecibels))
    simpleError(
      "cmrrDecibels",
      "Inputs produce an undefined or non-finite result.",
    );
  return { cmrrDecibels: Object.is(cmrrDecibels, -0) ? 0 : cmrrDecibels };
};

export const example = {
  input: { differentialGain: 1000, commonModeGain: 0.01 },
  output: { cmrrDecibels: 100 },
} satisfies ToolExample<
  InstrumentationAmplifierCmrrCalcInput,
  InstrumentationAmplifierCmrrCalcOutput
>;

export const tool = createSimpleTool({
  id: "electronics/instrumentation-amplifier-cmrr-calc",
  title: "Instrumentation Amplifier Cmrr Calc",
  description:
    "Common-mode rejection ratio in decibels from measured differential and common-mode voltage gain magnitudes.",
  inputs: [
    {
      id: "differentialGain",
      kind: "number",
      label: "Differential Gain",
      minimum: 0,
    },
    {
      id: "commonModeGain",
      kind: "number",
      label: "Common Mode Gain",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "cmrrDecibels", kind: "number", label: "Cmrr Decibels", unit: "dB" },
  ],
  calculate: (input) =>
    calculateInstrumentationAmplifierCmrrCalc({
      differentialGain: input.differentialGain as number,
      commonModeGain: input.commonModeGain as number,
    }),
});
export const instrumentationAmplifierCmrrCalcTool = tool;
export const runInstrumentationAmplifierCmrrCalc = tool.execute;
export default tool;
