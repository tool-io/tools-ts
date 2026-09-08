import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
  binary,
  unique,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerTransferIds: readonly string[];
  readonly independentlyRecordedSenderIds: readonly string[];
  readonly independentlyRecordedReceiverIds: readonly string[];
  readonly transferEvidenceKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "callerTransferIds", label: "Caller transfer ids", kind: "stringList" },
  {
    id: "independentlyRecordedSenderIds",
    label: "Independently recorded sender ids",
    kind: "stringList",
  },
  {
    id: "independentlyRecordedReceiverIds",
    label: "Independently recorded receiver ids",
    kind: "stringList",
  },
  {
    id: "transferEvidenceKnownFlags",
    label: "Transfer evidence known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerTransferIds, "transfers");
  for (const v of [
    input.independentlyRecordedSenderIds,
    input.independentlyRecordedReceiverIds,
    input.transferEvidenceKnownFlags,
  ])
    aligned(input.callerTransferIds, v, "links");
  if (
    [
      ...input.independentlyRecordedSenderIds,
      ...input.independentlyRecordedReceiverIds,
    ].some((v) => !v.trim())
  )
    simpleError(
      "custody",
      "Explicit nonempty independently established actor IDs.",
    );
  binary(input.transferEvidenceKnownFlags, "known");
  return {
    brokenKnownLinkIndices: input.callerTransferIds.flatMap((_, i) =>
      i &&
      input.transferEvidenceKnownFlags[i] &&
      input.transferEvidenceKnownFlags[i - 1] &&
      input.independentlyRecordedSenderIds[i] !==
        input.independentlyRecordedReceiverIds[i - 1]
        ? [i]
        : [],
    ),
    unknownAdjacentLinkIndices: input.callerTransferIds.flatMap((_, i) =>
      i &&
      (!input.transferEvidenceKnownFlags[i] ||
        !input.transferEvidenceKnownFlags[i - 1])
        ? [i]
        : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerTransferIds: ["t1", "t2", "t3"],
    independentlyRecordedSenderIds: ["a", "b", "c"],
    independentlyRecordedReceiverIds: ["b", "c", "d"],
    transferEvidenceKnownFlags: [1, 1, 1],
  },
  output: {
    result: { brokenKnownLinkIndices: [], unknownAdjacentLinkIndices: [] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/chain-of-custody-link-integrity-count-checker",
  title: "Chain Of Custody Link Integrity Count Checker",
  description:
    "Audit actual caller chronologically ordered custody transfer ledger for adjacent actor continuity, retaining unknown evidence. No timestamp authentication, admissibility, physical integrity or proof of misconduct.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
