import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, count, aligned, binary } from "../shared.js";
export type Input = Readonly<{
  readonly declaredRestrictionEndOrdinals: readonly number[];
  readonly documentedReleaseFlags: readonly number[];
  readonly asOfDayOrdinal: number;
}>;
export type Output = Readonly<{
  readonly signedDaysUntilRestrictionEnd: readonly number[];
  readonly unreleasedPastEndIndices: readonly number[];
  readonly documentedReleaseBeforeDeclaredEndIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "declaredRestrictionEndOrdinals",
    label: "Declared restriction end ordinals",
    kind: "numberList",
  },
  {
    id: "documentedReleaseFlags",
    label: "Documented release flags",
    kind: "numberList",
  },
  { id: "asOfDayOrdinal", label: "As of day ordinal", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.declaredRestrictionEndOrdinals.forEach((v) =>
    count(v, "declaredRestrictionEndOrdinals"),
  );
  count(input.asOfDayOrdinal, "asOfDayOrdinal");
  aligned(
    input.declaredRestrictionEndOrdinals,
    input.documentedReleaseFlags,
    "declaredRestrictionEndOrdinals",
  );
  binary(input.documentedReleaseFlags, "released");
  const d = input.declaredRestrictionEndOrdinals.map(
    (v) => v - input.asOfDayOrdinal,
  );
  return {
    signedDaysUntilRestrictionEnd: d,
    unreleasedPastEndIndices: d.flatMap((v, i) =>
      v < 0 && !input.documentedReleaseFlags[i] ? [i] : [],
    ),
    documentedReleaseBeforeDeclaredEndIndices: d.flatMap((v, i) =>
      v > 0 && input.documentedReleaseFlags[i] ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  declaredRestrictionEndOrdinals: [20, 30],
  documentedReleaseFlags: [0, 1],
  asOfDayOrdinal: 25,
} satisfies Input;
export const exampleOutput = {
  signedDaysUntilRestrictionEnd: [-5, 5],
  unreleasedPastEndIndices: [0],
  documentedReleaseBeforeDeclaredEndIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/deed-gift-restriction-countdown",
  title: "Deed of Gift Restriction Expiry Countdown Calculator",
  description:
    "Reconcile deed restriction countdown with independently documented release state and flag mismatches; no deed interpretation or automatic access/copyright permission.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedDaysUntilRestrictionEnd",
      label: "Signed days until restriction end",
      kind: "numberList",
    },
    {
      id: "unreleasedPastEndIndices",
      label: "Unreleased past end indices",
      kind: "numberList",
    },
    {
      id: "documentedReleaseBeforeDeclaredEndIndices",
      label: "Documented release before declared end indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      declaredRestrictionEndOrdinals:
        value.declaredRestrictionEndOrdinals as readonly number[],
      documentedReleaseFlags: value.documentedReleaseFlags as readonly number[],
      asOfDayOrdinal: value.asOfDayOrdinal as number,
    }),
});
export const run = tool.execute;
export default tool;
