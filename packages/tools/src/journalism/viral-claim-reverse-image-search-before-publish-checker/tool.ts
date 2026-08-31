import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  instants,
  instant,
  aligned,
  binary,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly plannedPublicationUtc: string;
  readonly reverseSearchPerformedUtcOrEmpty: string;
  readonly searchResultSourceUtc: readonly string[];
  readonly callerSameImageMatchFlags: readonly number[];
  readonly captionClaimedCaptureUtc: string;
}>;
export type Output = Readonly<{
  readonly searchCompletedBeforePlannedPublication: boolean;
  readonly matchedEarlierThanClaimResultIndices: readonly number[];
  readonly reverseSearchEvidenceAbsent: boolean;
}>;
const inputFields = [
  {
    id: "plannedPublicationUtc",
    label: "Planned publication utc",
    kind: "string",
  },
  {
    id: "reverseSearchPerformedUtcOrEmpty",
    label: "Reverse search performed utc or empty",
    kind: "string",
  },
  {
    id: "searchResultSourceUtc",
    label: "Search result source utc",
    kind: "stringList",
  },
  {
    id: "callerSameImageMatchFlags",
    label: "Caller same image match flags",
    kind: "numberList",
  },
  {
    id: "captionClaimedCaptureUtc",
    label: "Caption claimed capture utc",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(input.callerSameImageMatchFlags, "callerSameImageMatchFlags");
  if (
    input.searchResultSourceUtc.length !==
    input.callerSameImageMatchFlags.length
  )
    simpleError(
      "results",
      "Aligned search result evidence required; zero-result and unperformed searches remain distinct.",
    );
  const planned = instant(input.plannedPublicationUtc),
    claim = instant(input.captionClaimedCaptureUtc),
    results = instants(input.searchResultSourceUtc),
    missing = input.reverseSearchPerformedUtcOrEmpty === "",
    search = missing ? 0 : instant(input.reverseSearchPerformedUtcOrEmpty);
  if (missing && results.length)
    simpleError(
      "evidence",
      "Missing search cannot carry observed search results.",
    );
  return {
    searchCompletedBeforePlannedPublication: !missing && search <= planned,
    matchedEarlierThanClaimResultIndices: results.flatMap((v, i) =>
      input.callerSameImageMatchFlags[i] && v < claim ? [i] : [],
    ),
    reverseSearchEvidenceAbsent: missing,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  plannedPublicationUtc: "2025-01-01T12:00:00Z",
  reverseSearchPerformedUtcOrEmpty: "2025-01-01T10:00:00Z",
  searchResultSourceUtc: ["2024-01-01T00:00:00Z"],
  callerSameImageMatchFlags: [1],
  captionClaimedCaptureUtc: "2025-01-01T00:00:00Z",
} satisfies Input;
export const exampleOutput = {
  searchCompletedBeforePlannedPublication: true,
  matchedEarlierThanClaimResultIndices: [0],
  reverseSearchEvidenceAbsent: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/viral-claim-reverse-image-search-before-publish-checker",
  title: "Viral Claim Reverse Image Search Before Publish Checker",
  description:
    "Audit actual reverse-image-search completion and caller same-image result chronology before planned publication, flagging earlier evidence inconsistent with claimed capture; no network search, image matching or authenticity conclusion is performed.",
  inputs: inputFields,
  outputs: [
    {
      id: "searchCompletedBeforePlannedPublication",
      label: "Search completed before planned publication",
      kind: "boolean",
    },
    {
      id: "matchedEarlierThanClaimResultIndices",
      label: "Matched earlier than claim result indices",
      kind: "numberList",
    },
    {
      id: "reverseSearchEvidenceAbsent",
      label: "Reverse search evidence absent",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      plannedPublicationUtc: value.plannedPublicationUtc as string,
      reverseSearchPerformedUtcOrEmpty:
        value.reverseSearchPerformedUtcOrEmpty as string,
      searchResultSourceUtc: value.searchResultSourceUtc as readonly string[],
      callerSameImageMatchFlags:
        value.callerSameImageMatchFlags as readonly number[],
      captionClaimedCaptureUtc: value.captionClaimedCaptureUtc as string,
    }),
});
export const run = tool.execute;
export default tool;
