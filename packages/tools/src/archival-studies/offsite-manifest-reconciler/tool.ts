import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, lines } from "../shared.js";
export type Input = Readonly<{
  readonly expectedManifestBoxIds: string;
  readonly observedArrivalBoxIds: string;
}>;
export type Output = Readonly<{
  readonly missingExpectedBoxIds: readonly string[];
  readonly unexpectedArrivalBoxIds: readonly string[];
  readonly duplicateArrivalBoxIds: readonly string[];
  readonly exactManifestReconciled: boolean;
}>;
const inputFields = [
  {
    id: "expectedManifestBoxIds",
    label: "Expected manifest box ids",
    kind: "string",
  },
  {
    id: "observedArrivalBoxIds",
    label: "Observed arrival box ids",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const expected = lines(input.expectedManifestBoxIds, "expected", true),
    arrived = lines(input.observedArrivalBoxIds, "arrivals", true);
  if (new Set(expected).size !== expected.length)
    simpleError("manifest", "Expected manifest identities must be unique.");
  const set = new Set(expected),
    counts = new Map<string, number>();
  arrived.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1));
  const missing = expected.filter((v) => !counts.has(v)),
    unexpected = [...counts.keys()].filter((v) => !set.has(v)),
    duplicates = [...counts.keys()].filter((v) => counts.get(v)! > 1);
  return {
    missingExpectedBoxIds: missing,
    unexpectedArrivalBoxIds: unexpected,
    duplicateArrivalBoxIds: duplicates,
    exactManifestReconciled:
      !missing.length && !unexpected.length && !duplicates.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  expectedManifestBoxIds: "A\nB\nC",
  observedArrivalBoxIds: "B\nC\nD",
} satisfies Input;
export const exampleOutput = {
  missingExpectedBoxIds: ["A"],
  unexpectedArrivalBoxIds: ["D"],
  duplicateArrivalBoxIds: [],
  exactManifestReconciled: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/offsite-manifest-reconciler",
  title: "Offsite Storage Transport Manifest Box Count Reconciler",
  description:
    "Reconcile stable expected/arrived box identities including duplicates, not mere equal counts or inferred transport chain of custody.",
  inputs: inputFields,
  outputs: [
    {
      id: "missingExpectedBoxIds",
      label: "Missing expected box ids",
      kind: "stringList",
    },
    {
      id: "unexpectedArrivalBoxIds",
      label: "Unexpected arrival box ids",
      kind: "stringList",
    },
    {
      id: "duplicateArrivalBoxIds",
      label: "Duplicate arrival box ids",
      kind: "stringList",
    },
    {
      id: "exactManifestReconciled",
      label: "Exact manifest reconciled",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      expectedManifestBoxIds: value.expectedManifestBoxIds as string,
      observedArrivalBoxIds: value.observedArrivalBoxIds as string,
    }),
});
export const run = tool.execute;
export default tool;
