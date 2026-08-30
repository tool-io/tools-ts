import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PreEmphasisDbInput = Readonly<{
  readonly emphasizedAmplitudeV: number;
  readonly baselineAmplitudeV: number;
}>;
export type PreEmphasisDbOutput = Readonly<{
  readonly preEmphasisDb: number;
}>;

export const calculatePreEmphasisDb = (
  x: PreEmphasisDbInput,
): PreEmphasisDbOutput => {
  if (!Number.isFinite(x.emphasizedAmplitudeV) || x.emphasizedAmplitudeV < 0)
    simpleError("emphasizedAmplitudeV", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.baselineAmplitudeV) || x.baselineAmplitudeV < 0)
    simpleError("baselineAmplitudeV", "Provide a finite number at least 0.");
  if (!(
    x.emphasizedAmplitudeV >= x.baselineAmplitudeV && x.baselineAmplitudeV > 0
  ))
    simpleError(
      "input",
      "Emphasized amplitude must be at least the positive baseline amplitude.",
    );
  const preEmphasisDb =
    20 * Math.log10(x.emphasizedAmplitudeV / x.baselineAmplitudeV);
  if (!Number.isFinite(preEmphasisDb))
    simpleError("preEmphasisDb", "The inputs produce an invalid result.");
  return { preEmphasisDb: Object.is(preEmphasisDb, -0) ? 0 : preEmphasisDb };
};

export const example = {
  input: { emphasizedAmplitudeV: 2, baselineAmplitudeV: 1 },
  output: { preEmphasisDb: 6.020599913279624 },
} satisfies ToolExample<PreEmphasisDbInput, PreEmphasisDbOutput>;

export const tool = createSimpleTool({
  id: "electronics/pre-emphasis-db",
  title: "Pre Emphasis Db",
  description:
    "Express transmitted pre-emphasized signal amplitude relative to the baseline amplitude in voltage decibels.",
  inputs: [
    {
      id: "emphasizedAmplitudeV",
      kind: "number",
      label: "Emphasized amplitude",
      unit: "V",
      minimum: 0,
    },
    {
      id: "baselineAmplitudeV",
      kind: "number",
      label: "Baseline amplitude",
      unit: "V",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "preEmphasisDb", kind: "number", label: "Pre-emphasis", unit: "dB" },
  ],
  calculate: (input) =>
    calculatePreEmphasisDb({
      emphasizedAmplitudeV: input.emphasizedAmplitudeV as number,
      baselineAmplitudeV: input.baselineAmplitudeV as number,
    }),
});
export const preEmphasisDbTool = tool;
export const runPreEmphasisDb = tool.execute;
export default tool;
