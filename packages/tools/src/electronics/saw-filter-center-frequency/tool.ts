import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SawFilterCenterFrequencyInput = {
  readonly pitchUm: number;
  readonly velocityMsPerS?: number;
};

export type SawFilterCenterFrequencyOutput = {
  readonly centerFrequencyMhz: number;
};

export const sawFilterCenterFrequencyExample = {
  input: { pitchUm: 1 },
  output: { centerFrequencyMhz: 1575 },
} satisfies ToolExample<
  SawFilterCenterFrequencyInput,
  SawFilterCenterFrequencyOutput
>;

export const calculateSawFilterCenterFrequency = (
  input: SawFilterCenterFrequencyInput,
): SawFilterCenterFrequencyOutput => {
  if (!(input.pitchUm > 0))
    simpleError("pitchUm", "Pitch must be positive.", "invalid_pitch");
  const velocityMsPerS = input.velocityMsPerS ?? 3150;
  if (!(velocityMsPerS > 0))
    simpleError(
      "velocityMsPerS",
      "Acoustic velocity must be positive.",
      "invalid_velocity",
    );
  return { centerFrequencyMhz: velocityMsPerS / (2 * input.pitchUm) };
};

export const sawFilterCenterFrequencyTool = createSimpleTool({
  calculate: (input) =>
    calculateSawFilterCenterFrequency(
      input as unknown as SawFilterCenterFrequencyInput,
    ),
  description:
    "Compute the center frequency of a SAW transducer from its interdigital finger pitch and acoustic velocity; the acoustic wavelength is twice the finger pitch.",
  id: "electronics/saw-filter-center-frequency",
  inputs: [
    {
      description: "Interdigital transducer finger pitch.",
      format: "length",
      id: "pitchUm",
      kind: "number",
      label: "Finger pitch",
      unit: "µm",
    },
    {
      default: 3150,
      description:
        "Acoustic surface-wave velocity on the substrate in metres per second.",
      id: "velocityMsPerS",
      kind: "number",
      label: "Acoustic velocity",
      unit: "m/s",
    },
  ],
  outputs: [
    {
      description: "Center frequency of the SAW filter response.",
      format: "frequency",
      id: "centerFrequencyMhz",
      kind: "number",
      label: "Center frequency",
      unit: "MHz",
    },
  ],
  title: "SAW Center Frequency",
});
export const runSawFilterCenterFrequency = sawFilterCenterFrequencyTool.execute;
export default sawFilterCenterFrequencyTool;
