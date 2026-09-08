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
  readonly callerExaminedToothIds: readonly string[];
  readonly independentlyQualifiedHypoplasiaFlags: readonly number[];
  readonly toothEvidenceKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerExaminedToothIds",
    label: "Caller examined tooth ids",
    kind: "stringList",
  },
  {
    id: "independentlyQualifiedHypoplasiaFlags",
    label: "Independently qualified hypoplasia flags",
    kind: "numberList",
  },
  {
    id: "toothEvidenceKnownFlags",
    label: "Tooth evidence known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerExaminedToothIds, "teeth");
  aligned(
    input.callerExaminedToothIds,
    input.independentlyQualifiedHypoplasiaFlags,
    "flags",
  );
  aligned(input.callerExaminedToothIds, input.toothEvidenceKnownFlags, "known");
  binary(input.independentlyQualifiedHypoplasiaFlags, "flags");
  binary(input.toothEvidenceKnownFlags, "known");
  const ids = input.callerExaminedToothIds.filter(
    (_, i) =>
      input.toothEvidenceKnownFlags[i] &&
      input.independentlyQualifiedHypoplasiaFlags[i],
  );
  return {
    knownHypoplasiaToothIds: ids,
    knownHypoplasiaToothCount: ids.length,
    unknownToothIds: input.callerExaminedToothIds.filter(
      (_, i) => !input.toothEvidenceKnownFlags[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerExaminedToothIds: ["11", "12", "13"],
    independentlyQualifiedHypoplasiaFlags: [1, 0, 1],
    toothEvidenceKnownFlags: [1, 1, 0],
  },
  output: {
    result: {
      knownHypoplasiaToothIds: ["11"],
      knownHypoplasiaToothCount: 1,
      unknownToothIds: ["13"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/enamel-hypoplasia-count",
  title: "Enamel Hypoplasia Count Tool",
  description:
    "Actual distinct independently assessed enamel-hypoplasiatooth tally. Hypoplasia versus hypomineralization/developmental defects requires clinical assessment, not automatic disease identification.",
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
