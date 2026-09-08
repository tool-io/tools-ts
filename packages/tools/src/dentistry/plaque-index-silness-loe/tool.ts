import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  bounded,
  mean,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyCodedSiteScores: readonly number[];
  readonly siteEvidenceKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyCodedSiteScores",
    label: "Independently coded site scores",
    kind: "numberList",
  },
  {
    id: "siteEvidenceKnownFlags",
    label: "Site evidence known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.independentlyCodedSiteScores,
    input.siteEvidenceKnownFlags,
    "sites",
  );
  binary(input.siteEvidenceKnownFlags, "known");
  input.independentlyCodedSiteScores.forEach((v) =>
    bounded(v, "site-code", 0, 3),
  );
  const k = input.independentlyCodedSiteScores.filter(
    (_, i) => input.siteEvidenceKnownFlags[i],
  );
  return {
    observedKnownSiteMeanScore: mean(k),
    knownSiteCount: k.length,
    unknownSiteIndices: input.siteEvidenceKnownFlags.flatMap((v, i) =>
      v ? [] : [i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyCodedSiteScores: [1, 1, 1, 1],
    siteEvidenceKnownFlags: [1, 1, 1, 1],
  },
  output: {
    result: {
      observedKnownSiteMeanScore: 1,
      knownSiteCount: 4,
      unknownSiteIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/plaque-index-silness-loe",
  title: "Silness-L\u00f6e Plaque Index Calculator",
  description:
    "Actual Silness\u2013Loeplaque index, declared independently scored surfaces/tooth sites mean of known ordinalcodes0\u20133. Actual instrument version, surface selection and clinician scoring independently verified; partial mean explicitly not complete-mouth index or diagnosis.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
