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
  readonly callerVerifiedTourismRestrictionKeys: readonly string[];
  readonly callerVerifiedTourismRestrictionNotices: readonly string[];
  readonly queryTourismRestrictionKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedTourismRestrictionKeys",
    label: "Caller verified tourism restriction keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedTourismRestrictionNotices",
    label: "Caller verified tourism restriction notices",
    kind: "stringList",
  },
  {
    id: "queryTourismRestrictionKey",
    label: "Query tourism restriction key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerVerifiedTourismRestrictionKeys,
    input.callerVerifiedTourismRestrictionNotices,
    "callerVerifiedTourismRestrictionKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedTourismRestrictionKeys,
    input.queryTourismRestrictionKey,
  );
  if (input.callerVerifiedTourismRestrictionNotices.some((v) => !v.trim()))
    simpleError("notice", "Explicit caller verified notices required.");
  return {
    matchedCallerNotice: input.callerVerifiedTourismRestrictionNotices[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedTourismRestrictionKeys: [
    "site-a/edition-a",
    "site-a/edition-b",
  ],
  callerVerifiedTourismRestrictionNotices: [
    "caller notice a",
    "caller notice b",
  ],
  queryTourismRestrictionKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller notice b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/tourism-red-zone-restriction-lookup",
  title: "Tourism Red Zone Restriction Lookup",
  description:
    "Read independently verified site/authority/document-time tourism restriction notice, not present access permission. Only exact caller independently verified authority/site/edition key, no live status or generalized safety rule. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      callerVerifiedTourismRestrictionKeys:
        value.callerVerifiedTourismRestrictionKeys as readonly string[],
      callerVerifiedTourismRestrictionNotices:
        value.callerVerifiedTourismRestrictionNotices as readonly string[],
      queryTourismRestrictionKey: value.queryTourismRestrictionKey as string,
    }),
});
export const run = tool.execute;
export default tool;
