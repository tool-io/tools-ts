import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedAddressPronounKeys: readonly string[];
  readonly callerVerifiedAddressPronounNotices: readonly string[];
  readonly queryAddressPronounKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedAddressPronounKeys",
    label: "Caller verified address pronoun keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedAddressPronounNotices",
    label: "Caller verified address pronoun notices",
    kind: "stringList",
  },
  {
    id: "queryAddressPronounKey",
    label: "Query address pronoun key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedAddressPronounKeys,
      input.callerVerifiedAddressPronounNotices,
      input.queryAddressPronounKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedAddressPronounKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedAddressPronounNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryAddressPronounKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/usted-vs-tu-region-map-lookup",
  title: "Usted vs Tú Region Map Lookup",
  description:
    "Independently verified region/register/relationship usted/tú usage reference, not universal etiquette advice. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedAddressPronounKeys:
        value.callerVerifiedAddressPronounKeys as readonly string[],
      callerVerifiedAddressPronounNotices:
        value.callerVerifiedAddressPronounNotices as readonly string[],
      queryAddressPronounKey: value.queryAddressPronounKey as string,
    }),
});
export const run = tool.execute;
export default tool;
