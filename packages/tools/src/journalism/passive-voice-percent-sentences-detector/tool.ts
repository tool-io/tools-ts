import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  binary,
  sum,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly independentlyAnnotatedPassiveSentenceFlags: readonly number[];
  readonly knownSentenceAnalysisFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownPassiveSentencePercent: number;
  readonly knownSentenceAnalysisCount: number;
  readonly unknownSentenceAnalysisIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "independentlyAnnotatedPassiveSentenceFlags",
    label: "Independently annotated passive sentence flags",
    kind: "numberList",
  },
  {
    id: "knownSentenceAnalysisFlags",
    label: "Known sentence analysis flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(
    input.independentlyAnnotatedPassiveSentenceFlags,
    "independentlyAnnotatedPassiveSentenceFlags",
  );
  binary(input.knownSentenceAnalysisFlags, "knownSentenceAnalysisFlags");
  aligned(
    input.independentlyAnnotatedPassiveSentenceFlags,
    input.knownSentenceAnalysisFlags,
    "independentlyAnnotatedPassiveSentenceFlags",
  );
  const n = positive(
    sum(input.knownSentenceAnalysisFlags),
    "known syntactic analyses",
  );
  return {
    knownPassiveSentencePercent:
      (100 *
        sum(
          input.independentlyAnnotatedPassiveSentenceFlags.map(
            (v, i) => v * input.knownSentenceAnalysisFlags[i],
          ),
        )) /
      n,
    knownSentenceAnalysisCount: n,
    unknownSentenceAnalysisIndices: input.knownSentenceAnalysisFlags.flatMap(
      (v, i) => (!v ? [i] : []),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentlyAnnotatedPassiveSentenceFlags: [1, 0, 1],
  knownSentenceAnalysisFlags: [1, 1, 0],
} satisfies Input;
export const exampleOutput = {
  knownPassiveSentencePercent: 50,
  knownSentenceAnalysisCount: 2,
  unknownSentenceAnalysisIndices: [2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/passive-voice-percent-sentences-detector",
  title: "Passive Voice Percent Sentences Detector",
  description:
    "Tally independently syntactically analyzed sentence passive evidence with unknowns excluded; not a be+participle regex falsely identifying adjectival predicates or automatic prose-quality diagnosis. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownPassiveSentencePercent",
      label: "Known passive sentence percent",
      kind: "number",
    },
    {
      id: "knownSentenceAnalysisCount",
      label: "Known sentence analysis count",
      kind: "number",
    },
    {
      id: "unknownSentenceAnalysisIndices",
      label: "Unknown sentence analysis indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      independentlyAnnotatedPassiveSentenceFlags:
        value.independentlyAnnotatedPassiveSentenceFlags as readonly number[],
      knownSentenceAnalysisFlags:
        value.knownSentenceAnalysisFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
