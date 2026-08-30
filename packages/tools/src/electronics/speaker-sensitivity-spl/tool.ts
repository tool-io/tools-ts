import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpeakerSensitivitySplInput = Readonly<{
  readonly referenceSplDb: number;
  readonly referencePowerW: number;
  readonly targetPowerW: number;
  readonly referenceDistanceM: number;
  readonly targetDistanceM: number;
}>;
export type SpeakerSensitivitySplOutput = Readonly<{
  readonly predictedSplDb: number;
}>;

export const calculateSpeakerSensitivitySpl = (
  x: SpeakerSensitivitySplInput,
): SpeakerSensitivitySplOutput => {
  if (!Number.isFinite(x.referenceSplDb))
    simpleError("referenceSplDb", "Provide a finite number.");
  if (!Number.isFinite(x.referencePowerW) || x.referencePowerW < 0)
    simpleError("referencePowerW", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.targetPowerW) || x.targetPowerW < 0)
    simpleError("targetPowerW", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.referenceDistanceM) || x.referenceDistanceM < 0)
    simpleError("referenceDistanceM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.targetDistanceM) || x.targetDistanceM < 0)
    simpleError("targetDistanceM", "Provide a finite number at least 0.");
  if (!(
    x.referencePowerW > 0 &&
    x.targetPowerW > 0 &&
    x.referenceDistanceM > 0 &&
    x.targetDistanceM > 0
  ))
    simpleError("input", "Powers and distances must be positive.");
  const predictedSplDb =
    x.referenceSplDb +
    10 * Math.log10(x.targetPowerW / x.referencePowerW) -
    20 * Math.log10(x.targetDistanceM / x.referenceDistanceM);
  if (!Number.isFinite(predictedSplDb))
    simpleError("predictedSplDb", "The inputs produce an invalid result.");
  return { predictedSplDb: Object.is(predictedSplDb, -0) ? 0 : predictedSplDb };
};

export const example = {
  input: {
    referenceSplDb: 90,
    referencePowerW: 1,
    targetPowerW: 4,
    referenceDistanceM: 1,
    targetDistanceM: 2,
  },
  output: { predictedSplDb: 90 },
} satisfies ToolExample<
  SpeakerSensitivitySplInput,
  SpeakerSensitivitySplOutput
>;

export const tool = createSimpleTool({
  id: "electronics/speaker-sensitivity-spl",
  title: "Speaker Sensitivity SPL",
  description:
    "Predict free-field speaker SPL at a new electrical input power and distance from a reference SPL measured at known power and distance.",
  inputs: [
    {
      id: "referenceSplDb",
      kind: "number",
      label: "Reference SPL",
      unit: "dB SPL",
    },
    {
      id: "referencePowerW",
      kind: "number",
      label: "Reference electrical power",
      unit: "W",
      minimum: 0,
    },
    {
      id: "targetPowerW",
      kind: "number",
      label: "Target electrical power",
      unit: "W",
      minimum: 0,
    },
    {
      id: "referenceDistanceM",
      kind: "number",
      label: "Reference distance",
      unit: "m",
      minimum: 0,
    },
    {
      id: "targetDistanceM",
      kind: "number",
      label: "Target distance",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "predictedSplDb",
      kind: "number",
      label: "Predicted SPL",
      unit: "dB SPL",
    },
  ],
  calculate: (input) =>
    calculateSpeakerSensitivitySpl({
      referenceSplDb: input.referenceSplDb as number,
      referencePowerW: input.referencePowerW as number,
      targetPowerW: input.targetPowerW as number,
      referenceDistanceM: input.referenceDistanceM as number,
      targetDistanceM: input.targetDistanceM as number,
    }),
});
export const speakerSensitivitySplTool = tool;
export const runSpeakerSensitivitySpl = tool.execute;
export default tool;
