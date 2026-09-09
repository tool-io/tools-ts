import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  unique,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly callerCandidateLesionIds: readonly string[];
  readonly independentlyQualifiedLesionFlags: readonly number[];
  readonly lesionEvidenceKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerCandidateLesionIds",
    label: "Caller candidate lesion ids",
    kind: "stringList",
  },
  {
    id: "independentlyQualifiedLesionFlags",
    label: "Independently qualified lesion flags",
    kind: "numberList",
  },
  {
    id: "lesionEvidenceKnownFlags",
    label: "Lesion evidence known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerCandidateLesionIds, "lesions");
  aligned(
    input.callerCandidateLesionIds,
    input.independentlyQualifiedLesionFlags,
    "classification",
  );
  aligned(
    input.callerCandidateLesionIds,
    input.lesionEvidenceKnownFlags,
    "known",
  );
  binary(input.independentlyQualifiedLesionFlags, "flags");
  binary(input.lesionEvidenceKnownFlags, "known");
  const q = input.callerCandidateLesionIds.filter(
    (_, i) =>
      input.lesionEvidenceKnownFlags[i] &&
      input.independentlyQualifiedLesionFlags[i],
  );
  return {
    knownQualifiedLesionCount: q.length,
    knownQualifiedLesionIds: q,
    knownExcludedLesionIds: input.callerCandidateLesionIds.filter(
      (_, i) =>
        input.lesionEvidenceKnownFlags[i] &&
        !input.independentlyQualifiedLesionFlags[i],
    ),
    unknownLesionIds: input.callerCandidateLesionIds.filter(
      (_, i) => !input.lesionEvidenceKnownFlags[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerCandidateLesionIds: ["a", "b", "c"],
    independentlyQualifiedLesionFlags: [1, 0, 1],
    lesionEvidenceKnownFlags: [1, 1, 0],
  },
  output: {
    result: {
      knownQualifiedLesionCount: 1,
      knownQualifiedLesionIds: ["a"],
      knownExcludedLesionIds: ["b"],
      unknownLesionIds: ["c"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/gadolinium-enhancing-lesion-count",
  title: "Gadolinium Enhancing Lesion Count Tool",
  description:
    "Actual distinct candidate inventory of independently qualified gadolinium-enhancing lesions, retaining excluded and unknown evidence. Clinical/image assignment external, not automatic detection or etiology/prognosis.",
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
