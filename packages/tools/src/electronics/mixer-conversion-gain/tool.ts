import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MixerConversionGainInput = Readonly<{
  readonly rfInputDbm: number;
  readonly ifOutputDbm: number;
}>;
export type MixerConversionGainOutput = Readonly<{
  readonly conversionGainDb: number;
}>;

export const calculateMixerConversionGain = (
  x: MixerConversionGainInput,
): MixerConversionGainOutput => {
  if (!Number.isFinite(x.rfInputDbm))
    simpleError("rfInputDbm", "Provide a finite number.");
  if (!Number.isFinite(x.ifOutputDbm))
    simpleError("ifOutputDbm", "Provide a finite number.");
  const conversionGainDb = x.ifOutputDbm - x.rfInputDbm;
  if (!Number.isFinite(conversionGainDb))
    simpleError(
      "conversionGainDb",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    conversionGainDb: Object.is(conversionGainDb, -0) ? 0 : conversionGainDb,
  };
};

export const example = {
  input: { rfInputDbm: -20, ifOutputDbm: -27 },
  output: { conversionGainDb: -7 },
} satisfies ToolExample<MixerConversionGainInput, MixerConversionGainOutput>;

export const tool = createSimpleTool({
  id: "electronics/mixer-conversion-gain",
  title: "Mixer Conversion Gain",
  description:
    "Mixer conversion gain from desired IF output power and RF input power at the specified LO drive.",
  inputs: [
    { id: "rfInputDbm", kind: "number", label: "Rf Input Dbm", unit: "dBm" },
    { id: "ifOutputDbm", kind: "number", label: "If Output Dbm", unit: "dBm" },
  ],
  outputs: [
    {
      id: "conversionGainDb",
      kind: "number",
      label: "Conversion Gain Db",
      unit: "dB",
    },
  ],
  calculate: (input) =>
    calculateMixerConversionGain({
      rfInputDbm: input.rfInputDbm as number,
      ifOutputDbm: input.ifOutputDbm as number,
    }),
});
export const mixerConversionGainTool = tool;
export const runMixerConversionGain = tool.execute;
export default tool;
