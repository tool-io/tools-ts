import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TransconductanceEfficiencyGmIdInput = {
  readonly subthresholdIdealityFactor?: number;
  readonly temperatureKelvin?: number;
};

export type TransconductanceEfficiencyGmIdOutput = {
  readonly gmOverIdPerVolt: number;
};

export const transconductanceEfficiencyGmIdExample = {
  input: { subthresholdIdealityFactor: 1 },
  output: { gmOverIdPerVolt: 38.68172707248528 },
} satisfies ToolExample<
  TransconductanceEfficiencyGmIdInput,
  TransconductanceEfficiencyGmIdOutput
>;

export const transconductanceEfficiencyGmIdTool = createSimpleTool({
  calculate: (input) => {
    const ideality = input.subthresholdIdealityFactor as number;
    const temperatureKelvin = input.temperatureKelvin as number;
    if (!(temperatureKelvin > 0))
      simpleError("temperatureKelvin", "Temperature must be positive.");
    return {
      gmOverIdPerVolt: 1 / (ideality * 8.617333262e-5 * temperatureKelvin),
    };
  },
  description:
    "Compute the weak-inversion MOSFET transconductance efficiency gm/ID = 1/(n kT/q) from ideality factor and absolute temperature.",
  id: "semiconductor/transconductance-efficiency-gm-id",
  inputs: [
    {
      default: 1,
      description: "Subthreshold swing ideality factor between 1 and 2.",
      id: "subthresholdIdealityFactor",
      kind: "number",
      label: "Subthreshold ideality factor",
      maximum: 2,
      minimum: 1,
    },
    {
      default: 300,
      description: "Absolute device temperature.",
      id: "temperatureKelvin",
      kind: "number",
      label: "Temperature",
      minimum: 0,
      unit: "K",
    },
  ],
  outputs: [
    {
      description: "Transconductance efficiency gm/ID per volt of ID.",
      format: "per-volt",
      id: "gmOverIdPerVolt",
      kind: "number",
      label: "GM/ID efficiency",
      unit: "V^-1",
    },
  ],
  title: "Weak-Inversion GM/ID Calculator",
});
export const runTransconductanceEfficiencyGmId =
  transconductanceEfficiencyGmIdTool.execute;
export default transconductanceEfficiencyGmIdTool;
