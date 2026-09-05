import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  unique,
  sum,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerJurisdictionIds: readonly string[];
  readonly callerVerifiedOfficialFlags: readonly number[];
  readonly callerKnownStatusFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownOfficialCount: number;
  readonly unverifiedJurisdictionIds: readonly string[];
}>;
const inputFields = [
  {
    id: "callerJurisdictionIds",
    label: "Caller jurisdiction ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedOfficialFlags",
    label: "Caller verified official flags",
    kind: "numberList",
  },
  {
    id: "callerKnownStatusFlags",
    label: "Caller known status flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(input.callerVerifiedOfficialFlags, "callerVerifiedOfficialFlags");
  binary(input.callerKnownStatusFlags, "callerKnownStatusFlags");
  aligned(
    input.callerJurisdictionIds,
    input.callerVerifiedOfficialFlags,
    "callerJurisdictionIds",
  );
  aligned(
    input.callerJurisdictionIds,
    input.callerKnownStatusFlags,
    "callerJurisdictionIds",
  );
  unique(input.callerJurisdictionIds, "jurisdictions");
  return {
    knownOfficialCount: sum(
      input.callerVerifiedOfficialFlags.map(
        (v, i) => v * input.callerKnownStatusFlags[i],
      ),
    ),
    unverifiedJurisdictionIds: input.callerJurisdictionIds.filter(
      (_, i) => !input.callerKnownStatusFlags[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerJurisdictionIds: ["a", "b", "c"],
  callerVerifiedOfficialFlags: [1, 0, 1],
  callerKnownStatusFlags: [1, 0, 1],
} satisfies Input;
export const exampleOutput = {
  knownOfficialCount: 2,
  unverifiedJurisdictionIds: ["b"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/official-language-countries-count-lookup",
  title: "Countries Count By Official Language Lookup",
  description:
    "Count actual distinct caller verified official-language jurisdictions, separately preserve unknown status and declared jurisdiction universe; no inferred global country total. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
  inputs: inputFields,
  outputs: [
    { id: "knownOfficialCount", label: "Known official count", kind: "number" },
    {
      id: "unverifiedJurisdictionIds",
      label: "Unverified jurisdiction ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerJurisdictionIds: value.callerJurisdictionIds as readonly string[],
      callerVerifiedOfficialFlags:
        value.callerVerifiedOfficialFlags as readonly number[],
      callerKnownStatusFlags: value.callerKnownStatusFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
