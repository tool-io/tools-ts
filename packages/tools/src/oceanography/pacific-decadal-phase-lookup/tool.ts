import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedPacificDecadalPhaseKeys: readonly string[];
  readonly callerVerifiedPacificDecadalPhaseNotices: readonly string[];
  readonly queryPacificDecadalPhaseKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedPacificDecadalPhaseKeys",
    label: "Caller verified pacific decadal phase keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedPacificDecadalPhaseNotices",
    label: "Caller verified pacific decadal phase notices",
    kind: "stringList",
  },
  {
    id: "queryPacificDecadalPhaseKey",
    label: "Query pacific decadal phase key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerVerifiedPacificDecadalPhaseKeys,
    input.callerVerifiedPacificDecadalPhaseNotices,
    "callerVerifiedPacificDecadalPhaseKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedPacificDecadalPhaseKeys,
    input.queryPacificDecadalPhaseKey,
  );
  if (input.callerVerifiedPacificDecadalPhaseNotices.some((v) => !v.trim()))
    simpleError("notice", "Explicit caller verified notices required.");
  return {
    matchedCallerNotice: input.callerVerifiedPacificDecadalPhaseNotices[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedPacificDecadalPhaseKeys: [
    "site-a/edition-a",
    "site-a/edition-b",
  ],
  callerVerifiedPacificDecadalPhaseNotices: [
    "caller notice a",
    "caller notice b",
  ],
  queryPacificDecadalPhaseKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller notice b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/pacific-decadal-phase-lookup",
  title: "Pacific Decadal Phase Lookup",
  description:
    "Read independently supplied exact PDO index-source/baseline/window phase key; not live phase or generic ENSO classification. Only exact caller independently verified authority/site/edition key, no live status or generalized safety rule. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchedCallerNotice",
      label: "Matched caller notice",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedPacificDecadalPhaseKeys:
        value.callerVerifiedPacificDecadalPhaseKeys as readonly string[],
      callerVerifiedPacificDecadalPhaseNotices:
        value.callerVerifiedPacificDecadalPhaseNotices as readonly string[],
      queryPacificDecadalPhaseKey: value.queryPacificDecadalPhaseKey as string,
    }),
});
export const run = tool.execute;
export default tool;
