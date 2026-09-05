import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedUvularRhoticKeys: readonly string[];
  readonly callerVerifiedUvularRhoticNotices: readonly string[];
  readonly queryUvularRhoticKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedUvularRhoticKeys",
    label: "Caller verified uvular rhotic keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedUvularRhoticNotices",
    label: "Caller verified uvular rhotic notices",
    kind: "stringList",
  },
  {
    id: "queryUvularRhoticKey",
    label: "Query uvular rhotic key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedUvularRhoticKeys,
      input.callerVerifiedUvularRhoticNotices,
      input.queryUvularRhoticKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedUvularRhoticKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedUvularRhoticNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryUvularRhoticKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/uvular-r-language-lookup",
  title: "Uvular R Language Lookup",
  description:
    "Caller independently documented context-specific uvular rhotic evidence, not universal r pronunciation by nationality. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedUvularRhoticKeys:
        value.callerVerifiedUvularRhoticKeys as readonly string[],
      callerVerifiedUvularRhoticNotices:
        value.callerVerifiedUvularRhoticNotices as readonly string[],
      queryUvularRhoticKey: value.queryUvularRhoticKey as string,
    }),
});
export const run = tool.execute;
export default tool;
