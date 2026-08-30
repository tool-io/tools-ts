import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly couplingFactor: number;
  readonly dominantBandSones: number;
  readonly otherBandsSumSones: number;
}>;
export type Output = Readonly<{ readonly aggregatedLoudnessSones: number }>;

export const calculate = (input: Input): Output => {
  if (
    !Number.isFinite(input.couplingFactor) ||
    input.couplingFactor < 0 ||
    input.couplingFactor > 1
  )
    simpleError(
      "couplingFactor",
      "Coupling factor must be from zero through one.",
      "invalid_factor",
    );
  if (
    !Number.isFinite(input.dominantBandSones) ||
    input.dominantBandSones < 0 ||
    !Number.isFinite(input.otherBandsSumSones) ||
    input.otherBandsSumSones < 0
  )
    simpleError(
      "dominantBandSones",
      "Band loudness values must be finite and nonnegative.",
      "invalid_loudness",
    );
  const aggregatedLoudnessSones =
    input.dominantBandSones + input.couplingFactor * input.otherBandsSumSones;
  if (!Number.isFinite(aggregatedLoudnessSones))
    simpleError(
      "dominantBandSones",
      "Aggregated loudness is out of range.",
      "numeric_overflow",
    );
  return { aggregatedLoudnessSones };
};

export const example = {
  input: { couplingFactor: 0.3, dominantBandSones: 10, otherBandsSumSones: 10 },
  output: { aggregatedLoudnessSones: 13 },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: { couplingFactor: 0, dominantBandSones: 5, otherBandsSumSones: 20 },
  output: { aggregatedLoudnessSones: 5 },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      couplingFactor: input.couplingFactor as number,
      dominantBandSones: input.dominantBandSones as number,
      otherBandsSumSones: input.otherBandsSumSones as number,
    }),
  description:
    "Combine a dominant band loudness with the sum of other bands using an explicit coupling factor; this does not claim the complete Stevens Mark VI procedure.",
  id: "acoustics/band-loudness-aggregation",
  inputs: [
    {
      id: "couplingFactor",
      kind: "number",
      label: "Caller-supplied coupling factor",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "dominantBandSones",
      kind: "number",
      label: "Dominant band loudness",
      minimum: 0,
      unit: "sone",
    },
    {
      id: "otherBandsSumSones",
      kind: "number",
      label: "Other-band loudness sum",
      minimum: 0,
      unit: "sone",
    },
  ],
  outputs: [
    {
      id: "aggregatedLoudnessSones",
      kind: "number",
      label: "Aggregated loudness",
      minimum: 0,
      unit: "sone",
    },
  ],
  title: "Band Loudness Aggregation",
});

export const run = tool.execute;
export default tool;
