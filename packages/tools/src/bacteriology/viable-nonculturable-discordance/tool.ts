import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { fraction, count } from "../shared.js";

export type Input = Readonly<{
  readonly viabilityAssayLive: number;
  readonly viabilityAssayTotal: number;
  readonly culturableCount: number;
  readonly matchedTotalCount: number;
  readonly minimumLiveFraction: number;
  readonly maximumCulturableFraction: number;
}>;
export type Output = Readonly<{
  readonly liveFraction: number;
  readonly culturableFraction: number;
  readonly discordantViabilityPattern: boolean;
}>;
export const calculate = (input: Input): Output => {
  count(input.viabilityAssayLive, "viabilityAssayLive");
  count(input.viabilityAssayTotal, "viabilityAssayTotal", 1);
  count(input.culturableCount, "culturableCount");
  count(input.matchedTotalCount, "matchedTotalCount", 1);
  fraction(input.minimumLiveFraction, "minimumLiveFraction");
  fraction(input.maximumCulturableFraction, "maximumCulturableFraction");
  if (
    input.viabilityAssayLive > input.viabilityAssayTotal ||
    input.culturableCount > input.matchedTotalCount
  )
    simpleError(
      "viabilityAssayLive",
      "Assay numerator counts must fit their aligned denominator counts.",
    );
  const liveFraction = input.viabilityAssayLive / input.viabilityAssayTotal,
    culturableFraction = input.culturableCount / input.matchedTotalCount;
  return {
    liveFraction,
    culturableFraction,
    discordantViabilityPattern:
      liveFraction >= input.minimumLiveFraction &&
      culturableFraction <= input.maximumCulturableFraction,
  };
};
export const exampleInput = {
  viabilityAssayLive: 90,
  viabilityAssayTotal: 100,
  culturableCount: 2,
  matchedTotalCount: 100,
  minimumLiveFraction: 0.8,
  maximumCulturableFraction: 0.05,
} satisfies Input;
export const exampleOutput = {
  liveFraction: 0.9,
  culturableFraction: 0.02,
  discordantViabilityPattern: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/viable-nonculturable-discordance",
  title: "Viable Nonculturable Discordance",
  description:
    "Screen discordance between viability assay and matched culturability; this pattern alone does not prove a VBNC state.",
  inputs: [
    {
      id: "viabilityAssayLive",
      label: "Viability assay live",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "viabilityAssayTotal",
      label: "Viability assay total",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "culturableCount",
      label: "Culturable count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "matchedTotalCount",
      label: "Matched total count",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "minimumLiveFraction",
      label: "Minimum live fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "maximumCulturableFraction",
      label: "Maximum culturable fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    { id: "liveFraction", label: "Live fraction", kind: "number" },
    { id: "culturableFraction", label: "Culturable fraction", kind: "number" },
    {
      id: "discordantViabilityPattern",
      label: "Discordant viability pattern",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      viabilityAssayLive: value.viabilityAssayLive as number,
      viabilityAssayTotal: value.viabilityAssayTotal as number,
      culturableCount: value.culturableCount as number,
      matchedTotalCount: value.matchedTotalCount as number,
      minimumLiveFraction: value.minimumLiveFraction as number,
      maximumCulturableFraction: value.maximumCulturableFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
