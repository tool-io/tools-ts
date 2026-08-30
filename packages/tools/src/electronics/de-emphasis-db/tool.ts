import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DeEmphasisDbInput = Readonly<{
  readonly referenceAmplitudeV: number;
  readonly deemphasizedAmplitudeV: number;
}>;
export type DeEmphasisDbOutput = Readonly<{
  readonly attenuationDb: number;
}>;

export const calculateDeEmphasisDb = (
  x: DeEmphasisDbInput,
): DeEmphasisDbOutput => {
  if (!Number.isFinite(x.referenceAmplitudeV) || x.referenceAmplitudeV < 0)
    simpleError("referenceAmplitudeV", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.deemphasizedAmplitudeV) ||
    x.deemphasizedAmplitudeV < 0
  )
    simpleError(
      "deemphasizedAmplitudeV",
      "Provide a finite number at least 0.",
    );
  if (!(
    x.referenceAmplitudeV > 0 &&
    x.deemphasizedAmplitudeV > 0 &&
    x.referenceAmplitudeV >= x.deemphasizedAmplitudeV
  ))
    simpleError(
      "input",
      "Reference amplitude must be at least the positive reduced amplitude.",
    );
  const attenuationDb =
    20 * Math.log10(x.referenceAmplitudeV / x.deemphasizedAmplitudeV);
  if (!Number.isFinite(attenuationDb))
    simpleError("attenuationDb", "The inputs produce an invalid result.");
  return { attenuationDb: Object.is(attenuationDb, -0) ? 0 : attenuationDb };
};

export const example = {
  input: { referenceAmplitudeV: 2, deemphasizedAmplitudeV: 1 },
  output: { attenuationDb: 6.020599913279624 },
} satisfies ToolExample<DeEmphasisDbInput, DeEmphasisDbOutput>;

export const tool = createSimpleTool({
  id: "electronics/de-emphasis-db",
  title: "De Emphasis Db",
  description:
    "Express reduction from reference amplitude to de-emphasized amplitude as a positive voltage attenuation in decibels.",
  inputs: [
    {
      id: "referenceAmplitudeV",
      kind: "number",
      label: "Reference amplitude",
      unit: "V",
      minimum: 0,
    },
    {
      id: "deemphasizedAmplitudeV",
      kind: "number",
      label: "De-emphasized amplitude",
      unit: "V",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "attenuationDb",
      kind: "number",
      label: "De-emphasis attenuation",
      unit: "dB",
    },
  ],
  calculate: (input) =>
    calculateDeEmphasisDb({
      referenceAmplitudeV: input.referenceAmplitudeV as number,
      deemphasizedAmplitudeV: input.deemphasizedAmplitudeV as number,
    }),
});
export const deEmphasisDbTool = tool;
export const runDeEmphasisDb = tool.execute;
export default tool;
