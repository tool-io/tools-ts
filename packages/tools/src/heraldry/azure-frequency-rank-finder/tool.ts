import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  unique,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly callerTinctureNames: readonly string[];
  readonly matchedOccurrenceCounts: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerTinctureNames",
    label: "Caller tincture names",
    kind: "stringList",
  },
  {
    id: "matchedOccurrenceCounts",
    label: "Matched occurrence counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerTinctureNames, "tinctures");
  aligned(input.callerTinctureNames, input.matchedOccurrenceCounts, "counts");
  input.matchedOccurrenceCounts.forEach((v) => bounded(v, "count", 0, 1000000));
  const k = input.callerTinctureNames.indexOf("azure");
  if (k < 0) simpleError("azure", "Explicit azure reference count needed.");
  const a = input.matchedOccurrenceCounts[k];
  return {
    azureCompetitionRank:
      1 + input.matchedOccurrenceCounts.filter((v) => v > a).length,
    tiedAzureRankNames: input.callerTinctureNames.filter(
      (_, i) => input.matchedOccurrenceCounts[i] === a,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerTinctureNames: ["gules", "azure", "or"],
    matchedOccurrenceCounts: [5, 3, 3],
  },
  output: {
    result: { azureCompetitionRank: 2, tiedAzureRankNames: ["azure", "or"] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/azure-frequency-rank-finder",
  title: "Azure Frequency Rank Finder in Roll",
  description:
    "Rank actual azure occurrences using competition ranking, preserving equal-frequency tinctures.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
