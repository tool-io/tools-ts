import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
  binary,
  bounded,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyCodedSextantScores: readonly number[];
  readonly sextantEvidenceKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyCodedSextantScores",
    label: "Independently coded sextant scores",
    kind: "numberList",
  },
  {
    id: "sextantEvidenceKnownFlags",
    label: "Sextant evidence known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.independentlyCodedSextantScores.length !== 6)
    simpleError("sextants", "Exactly six declared sextants.");
  aligned(
    input.independentlyCodedSextantScores,
    input.sextantEvidenceKnownFlags,
    "known",
  );
  binary(input.sextantEvidenceKnownFlags, "known");
  input.independentlyCodedSextantScores.forEach((v) =>
    bounded(v, "code", 0, 4),
  );
  const k = input.independentlyCodedSextantScores.filter(
    (_, i) => input.sextantEvidenceKnownFlags[i],
  );
  if (!k.length)
    simpleError("known", "At least one clinically qualified sextant code.");
  return {
    highestKnownSextantCode: Math.max(...k),
    knownSextantScores: k,
    unknownSextantIndices: input.sextantEvidenceKnownFlags.flatMap((v, i) =>
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
    independentlyCodedSextantScores: [0, 1, 2, 3, 4, 0],
    sextantEvidenceKnownFlags: [1, 1, 1, 1, 1, 1],
  },
  output: {
    result: {
      highestKnownSextantCode: 4,
      knownSextantScores: [0, 1, 2, 3, 4, 0],
      unknownSextantIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/basic-periodontal-examination-score",
  title: "BPE Score Calculator",
  description:
    "BPE actual six-sextant0\u20134code inventory and highest known code, not numeric sum. Excluded/untestable sextants represented as unknown, furcation*context separately assessed. Actual scoring/probe/version external, no periodontal diagnosis or automatic treatment need.",
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
