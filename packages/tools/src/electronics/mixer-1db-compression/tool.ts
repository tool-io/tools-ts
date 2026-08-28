import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Mixer1dbCompressionInput = {
  readonly ip3Dbm: number;
};

export type Mixer1dbCompressionOutput = {
  readonly mixerP1dbDbm: number;
};

export const mixer1dbCompressionExample = {
  input: { ip3Dbm: 5 },
  output: { mixerP1dbDbm: -5.5 },
} satisfies ToolExample<Mixer1dbCompressionInput, Mixer1dbCompressionOutput>;

export const calculateMixer1dbCompression = (
  input: Mixer1dbCompressionInput,
): Mixer1dbCompressionOutput => {
  if (!Number.isFinite(input.ip3Dbm))
    simpleError("ip3Dbm", "IP3 must be a finite value.");
  return { mixerP1dbDbm: input.ip3Dbm - 10.5 };
};

export const mixer1dbCompressionTool = createSimpleTool({
  calculate: (input) =>
    calculateMixer1dbCompression(input as unknown as Mixer1dbCompressionInput),
  description:
    "Estimate the 1 dB compression point of a mixer from its IP3 using the documented mixer-specific rule that P1dB sits 10.5 dB below the third-order intercept.",
  id: "electronics/mixer-1db-compression",
  inputs: [
    {
      description: "Third-order intercept point of the mixer.",
      format: "power",
      id: "ip3Dbm",
      kind: "number",
      label: "IP3",
      unit: "dBm",
    },
  ],
  outputs: [
    {
      description: "Estimated input 1 dB compression point.",
      format: "power",
      id: "mixerP1dbDbm",
      kind: "number",
      label: "P1dB",
      unit: "dBm",
    },
  ],
  title: "Mixer P1dB Rule",
});
export const runMixer1dbCompression = mixer1dbCompressionTool.execute;
export default mixer1dbCompressionTool;
