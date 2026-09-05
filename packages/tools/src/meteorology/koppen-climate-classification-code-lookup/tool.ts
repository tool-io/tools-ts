import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedKoppenCodeKeys: readonly string[];
  readonly callerVerifiedKoppenCodeNotices: readonly string[];
  readonly queryKoppenCodeKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedKoppenCodeKeys",
    label: "Caller verified koppen code keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedKoppenCodeNotices",
    label: "Caller verified koppen code notices",
    kind: "stringList",
  },
  { id: "queryKoppenCodeKey", label: "Query koppen code key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedKoppenCodeKeys,
      input.callerVerifiedKoppenCodeNotices,
      input.queryKoppenCodeKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedKoppenCodeKeys: ["site-a/edition-a", "site-a/edition-b"],
  callerVerifiedKoppenCodeNotices: ["caller reference a", "caller reference b"],
  queryKoppenCodeKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/koppen-climate-classification-code-lookup",
  title: "Koppen Climate Classification Code Lookup",
  description:
    "Caller verified Köppen edition/code meaning, not classifier inferred from code spelling. Exact independently verified location/jurisdiction/method/edition reference key, not a live database. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedKoppenCodeKeys:
        value.callerVerifiedKoppenCodeKeys as readonly string[],
      callerVerifiedKoppenCodeNotices:
        value.callerVerifiedKoppenCodeNotices as readonly string[],
      queryKoppenCodeKey: value.queryKoppenCodeKey as string,
    }),
});
export const run = tool.execute;
export default tool;
