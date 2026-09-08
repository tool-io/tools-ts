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
  readonly callerVerifiedLaharRainCriterionKeys: readonly string[];
  readonly callerVerifiedLaharRainCriterionNotices: readonly string[];
  readonly queryLaharRainCriterionKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedLaharRainCriterionKeys",
    label: "Caller verified lahar rain criterion keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedLaharRainCriterionNotices",
    label: "Caller verified lahar rain criterion notices",
    kind: "stringList",
  },
  {
    id: "queryLaharRainCriterionKey",
    label: "Query lahar rain criterion key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerVerifiedLaharRainCriterionKeys,
    input.callerVerifiedLaharRainCriterionNotices,
    "callerVerifiedLaharRainCriterionKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedLaharRainCriterionKeys,
    input.queryLaharRainCriterionKey,
  );
  if (input.callerVerifiedLaharRainCriterionNotices.some((v) => !v.trim()))
    simpleError("notice", "Explicit caller verified notices required.");
  return {
    matchedCallerNotice: input.callerVerifiedLaharRainCriterionNotices[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedLaharRainCriterionKeys: [
    "site-a/edition-a",
    "site-a/edition-b",
  ],
  callerVerifiedLaharRainCriterionNotices: [
    "caller notice a",
    "caller notice b",
  ],
  queryLaharRainCriterionKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller notice b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/lahar-warning-rain-threshold-mmhr-lookup",
  title: "Lahar Warning Rain Threshold MMHR Lookup",
  description:
    "Read independently verified catchment/antecedent-state/authority rain trigger notice, not universal rain threshold. Only exact caller independently verified authority/site/edition key, no live status or generalized safety rule. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      callerVerifiedLaharRainCriterionKeys:
        value.callerVerifiedLaharRainCriterionKeys as readonly string[],
      callerVerifiedLaharRainCriterionNotices:
        value.callerVerifiedLaharRainCriterionNotices as readonly string[],
      queryLaharRainCriterionKey: value.queryLaharRainCriterionKey as string,
    }),
});
export const run = tool.execute;
export default tool;
