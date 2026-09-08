import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
  binary,
  bounded,
  mean,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyCodedDebrisSiteScores: readonly number[];
  readonly independentlyCodedCalculusSiteScores: readonly number[];
  readonly siteEvidenceKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyCodedDebrisSiteScores",
    label: "Independently coded debris site scores",
    kind: "numberList",
  },
  {
    id: "independentlyCodedCalculusSiteScores",
    label: "Independently coded calculus site scores",
    kind: "numberList",
  },
  {
    id: "siteEvidenceKnownFlags",
    label: "Site evidence known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.independentlyCodedDebrisSiteScores.length !== 12)
    simpleError("sites", "Exactly declared instrument site count.");
  aligned(
    input.independentlyCodedDebrisSiteScores,
    input.independentlyCodedCalculusSiteScores,
    "sites",
  );
  aligned(
    input.independentlyCodedDebrisSiteScores,
    input.siteEvidenceKnownFlags,
    "known",
  );
  binary(input.siteEvidenceKnownFlags, "known");
  [
    input.independentlyCodedDebrisSiteScores,
    input.independentlyCodedCalculusSiteScores,
  ].forEach((v) => v.forEach((x) => bounded(x, "code", 0, 3)));
  const d = mean(
      input.independentlyCodedDebrisSiteScores.filter(
        (_, i) => input.siteEvidenceKnownFlags[i],
      ),
    ),
    c = mean(
      input.independentlyCodedCalculusSiteScores.filter(
        (_, i) => input.siteEvidenceKnownFlags[i],
      ),
    );
  return {
    observedKnownDebrisMean: d,
    observedKnownCalculusMean: c,
    observedKnownOhi: d + c,
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
    independentlyCodedDebrisSiteScores: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    independentlyCodedCalculusSiteScores: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    siteEvidenceKnownFlags: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  output: {
    result: {
      observedKnownDebrisMean: 1,
      observedKnownCalculusMean: 2,
      observedKnownOhi: 3,
      unknownSiteIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/oral-hygiene-index-greene-vermillion",
  title: "Greene-Vermillion Oral Hygiene Index Calculator",
  description:
    "Greene\u2013Vermillion original OHI12selected surface convention:mean debris+mean calculus on actual independently coded same selected sites0\u20133. Partial mean explicitly retains unknowns, not a complete mouth index or clinical interpretation.",
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
