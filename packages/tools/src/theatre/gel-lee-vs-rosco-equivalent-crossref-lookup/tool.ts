import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  safeText,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly callerSourceGelIds: readonly string[];
  readonly callerTargetGelIds: readonly string[];
  readonly measuredSameReferenceDeltaE: readonly number[];
  readonly requestedSourceGelId: string;
  readonly callerMaximumCandidateDeltaE: number;
}>;
export type Output = Readonly<{
  readonly callerCandidateTargetGelIds: readonly string[];
  readonly candidateMeasuredDeltaE: readonly number[];
}>;
const inputFields = [
  {
    id: "callerSourceGelIds",
    label: "Caller source gel ids",
    kind: "stringList",
  },
  {
    id: "callerTargetGelIds",
    label: "Caller target gel ids",
    kind: "stringList",
  },
  {
    id: "measuredSameReferenceDeltaE",
    label: "Measured same reference delta e",
    kind: "numberList",
  },
  {
    id: "requestedSourceGelId",
    label: "Requested source gel id",
    kind: "string",
  },
  {
    id: "callerMaximumCandidateDeltaE",
    label: "Caller maximum candidate delta e",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredSameReferenceDeltaE.forEach((v) =>
    nonnegative(v, "measuredSameReferenceDeltaE"),
  );
  nonnegative(
    input.callerMaximumCandidateDeltaE,
    "callerMaximumCandidateDeltaE",
  );
  aligned(
    input.callerSourceGelIds,
    input.callerTargetGelIds,
    "callerSourceGelIds",
  );
  aligned(
    input.callerSourceGelIds,
    input.measuredSameReferenceDeltaE,
    "callerSourceGelIds",
  );
  input.callerSourceGelIds.forEach((v) => safeText(v, "source"));
  input.callerTargetGelIds.forEach((v) => safeText(v, "target"));
  safeText(input.requestedSourceGelId, "request");
  if (!input.callerSourceGelIds.includes(input.requestedSourceGelId))
    simpleError("source", "Source absent from actual caller crossreference.");
  const rows = input.callerSourceGelIds
    .flatMap((s, i) =>
      s === input.requestedSourceGelId &&
      input.measuredSameReferenceDeltaE[i] <= input.callerMaximumCandidateDeltaE
        ? [i]
        : [],
    )
    .sort(
      (a, b) =>
        input.measuredSameReferenceDeltaE[a] -
          input.measuredSameReferenceDeltaE[b] || a - b,
    );
  return {
    callerCandidateTargetGelIds: rows.map((i) => input.callerTargetGelIds[i]),
    candidateMeasuredDeltaE: rows.map(
      (i) => input.measuredSameReferenceDeltaE[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSourceGelIds: ["L1", "L1", "L2"],
  callerTargetGelIds: ["R1", "R2", "R3"],
  measuredSameReferenceDeltaE: [2, 3, 1],
  requestedSourceGelId: "L1",
  callerMaximumCandidateDeltaE: 2.5,
} satisfies Input;
export const exampleOutput = {
  callerCandidateTargetGelIds: ["R1"],
  candidateMeasuredDeltaE: [2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/gel-lee-vs-rosco-equivalent-crossref-lookup",
  title: "Gel Lee vs Rosco Equivalent Crossref Lookup",
  description:
    "Filter actual caller Lee/Rosco crossreference measurements by source and same-reference color-distance ceiling; no invented proprietary equivalences, spectral match or identical rendition under another lamp.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerCandidateTargetGelIds",
      label: "Caller candidate target gel ids",
      kind: "stringList",
    },
    {
      id: "candidateMeasuredDeltaE",
      label: "Candidate measured delta e",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerSourceGelIds: value.callerSourceGelIds as readonly string[],
      callerTargetGelIds: value.callerTargetGelIds as readonly string[],
      measuredSameReferenceDeltaE:
        value.measuredSameReferenceDeltaE as readonly number[],
      requestedSourceGelId: value.requestedSourceGelId as string,
      callerMaximumCandidateDeltaE:
        value.callerMaximumCandidateDeltaE as number,
    }),
});
export const run = tool.execute;
export default tool;
