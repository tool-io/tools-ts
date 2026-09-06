import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedBoardCertificationKeys: readonly string[];
  readonly callerVerifiedBoardCertificationNotices: readonly string[];
  readonly queryBoardCertificationKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedBoardCertificationKeys",
    label: "Caller verified board certification keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedBoardCertificationNotices",
    label: "Caller verified board certification notices",
    kind: "stringList",
  },
  {
    id: "queryBoardCertificationKey",
    label: "Query board certification key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedBoardCertificationKeys,
      input.callerVerifiedBoardCertificationNotices,
      input.queryBoardCertificationKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedBoardCertificationKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedBoardCertificationNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryBoardCertificationKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/national-board-certification-component-portfolio-lookup",
  title: "National Board Certification Component Portfolio Lookup",
  description:
    "Caller independently verified National Board certificate cycle/area/component portfolio requirements, not current fees, eligibility or certification. Exact independently verified context/edition key; not embedded or live reference data. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
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
      callerVerifiedBoardCertificationKeys:
        value.callerVerifiedBoardCertificationKeys as readonly string[],
      callerVerifiedBoardCertificationNotices:
        value.callerVerifiedBoardCertificationNotices as readonly string[],
      queryBoardCertificationKey: value.queryBoardCertificationKey as string,
    }),
});
export const run = tool.execute;
export default tool;
