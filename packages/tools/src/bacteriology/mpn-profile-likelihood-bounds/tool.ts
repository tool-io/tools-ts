import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, tubeMpn, tubeLikelihood } from "../shared.js";

export type Input = Readonly<{
  readonly volumesMl: readonly number[];
  readonly positiveTubes: readonly number[];
  readonly totalTubes: readonly number[];
  readonly likelihoodRatioCritical: number;
}>;
export type Output = Readonly<{
  readonly mpnPerMl: number;
  readonly lowerMpnPerMl: number;
  readonly upperMpnPerMl: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.likelihoodRatioCritical, "likelihoodRatioCritical");
  const mpnPerMl = tubeMpn(input),
    cutoff =
      tubeLikelihood(input, mpnPerMl) - input.likelihoodRatioCritical / 2;
  let low = 0,
    high = mpnPerMl;
  for (let i = 0; i < 150; i++) {
    const mid = (low + high) / 2;
    if (tubeLikelihood(input, mid) < cutoff) low = mid;
    else high = mid;
  }
  const lowerMpnPerMl = (low + high) / 2;
  low = mpnPerMl;
  high = mpnPerMl * 2;
  for (let i = 0; i < 100 && tubeLikelihood(input, high) > cutoff; i++)
    high *= 2;
  if (!Number.isFinite(high) || tubeLikelihood(input, high) > cutoff)
    simpleError("volumesMl", "Cannot bracket finite upper likelihood bound.");
  for (let i = 0; i < 150; i++) {
    const mid = (low + high) / 2;
    if (tubeLikelihood(input, mid) > cutoff) low = mid;
    else high = mid;
  }
  return { mpnPerMl, lowerMpnPerMl, upperMpnPerMl: (low + high) / 2 };
};
export const exampleInput = {
  volumesMl: [1, 1, 1],
  positiveTubes: [1, 1, 1],
  totalTubes: [2, 2, 2],
  likelihoodRatioCritical: 1.7260924347106854,
} satisfies Input;
export const exampleOutput = {
  mpnPerMl: 0.6931471805599453,
  lowerMpnPerMl: 0.28768207245178085,
  upperMpnPerMl: 1.3862943611198906,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/mpn-profile-likelihood-bounds",
  title: "MPN Profile Likelihood Bounds",
  description:
    "Estimate MPN and profile-likelihood bounds from tube inoculum volumes and counts; caller supplies a likelihood-ratio critical value (about 3.84146 for asymptotic 95%).",
  inputs: [
    { id: "volumesMl", label: "Volumes ml", kind: "numberList" },
    { id: "positiveTubes", label: "Positive tubes", kind: "numberList" },
    { id: "totalTubes", label: "Total tubes", kind: "numberList" },
    {
      id: "likelihoodRatioCritical",
      label: "Likelihood ratio critical",
      kind: "number",
    },
  ],
  outputs: [
    { id: "mpnPerMl", label: "Mpn per ml", kind: "number" },
    { id: "lowerMpnPerMl", label: "Lower mpn per ml", kind: "number" },
    { id: "upperMpnPerMl", label: "Upper mpn per ml", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      volumesMl: value.volumesMl as readonly number[],
      positiveTubes: value.positiveTubes as readonly number[],
      totalTubes: value.totalTubes as readonly number[],
      likelihoodRatioCritical: value.likelihoodRatioCritical as number,
    }),
});
export const run = tool.execute;
export default tool;
