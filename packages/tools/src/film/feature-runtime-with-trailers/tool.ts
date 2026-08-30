import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FeatureRuntimeWithTrailersInput = Readonly<{
  readonly featureMinutes: number;
  readonly trailerMinutes: number;
  readonly intermissionMinutes: number;
}>;
export type FeatureRuntimeWithTrailersOutput = Readonly<{
  readonly programMinutes: number;
}>;

export const calculateFeatureRuntimeWithTrailers = (
  x: FeatureRuntimeWithTrailersInput,
): FeatureRuntimeWithTrailersOutput => {
  if (!Number.isFinite(x.featureMinutes) || x.featureMinutes < 0)
    simpleError("featureMinutes", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.trailerMinutes) || x.trailerMinutes < 0)
    simpleError("trailerMinutes", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.intermissionMinutes) || x.intermissionMinutes < 0)
    simpleError("intermissionMinutes", "Provide a finite number at least 0.");
  const programMinutes =
    x.featureMinutes + x.trailerMinutes + x.intermissionMinutes;
  if (!Number.isFinite(programMinutes))
    simpleError(
      "programMinutes",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { programMinutes: Object.is(programMinutes, -0) ? 0 : programMinutes };
};

export const example = {
  input: { featureMinutes: 90, trailerMinutes: 6, intermissionMinutes: 10 },
  output: { programMinutes: 106 },
} satisfies ToolExample<
  FeatureRuntimeWithTrailersInput,
  FeatureRuntimeWithTrailersOutput
>;

export const tool = createSimpleTool({
  id: "film/feature-runtime-with-trailers",
  title: "Feature Runtime With Trailers",
  description:
    "Program runtime from feature, trailer and intermission durations, all in minutes.",
  inputs: [
    {
      id: "featureMinutes",
      kind: "number",
      label: "Feature Minutes",
      unit: "min",
      minimum: 0,
    },
    {
      id: "trailerMinutes",
      kind: "number",
      label: "Trailer Minutes",
      unit: "min",
      minimum: 0,
    },
    {
      id: "intermissionMinutes",
      kind: "number",
      label: "Intermission Minutes",
      unit: "min",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "programMinutes",
      kind: "number",
      label: "Program Minutes",
      unit: "min",
    },
  ],
  calculate: (input) =>
    calculateFeatureRuntimeWithTrailers({
      featureMinutes: input.featureMinutes as number,
      trailerMinutes: input.trailerMinutes as number,
      intermissionMinutes: input.intermissionMinutes as number,
    }),
});
export const featureRuntimeWithTrailersTool = tool;
export const runFeatureRuntimeWithTrailers = tool.execute;
export default tool;
