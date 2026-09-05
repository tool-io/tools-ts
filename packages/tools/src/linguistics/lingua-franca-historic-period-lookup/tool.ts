import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedHistoricLinguaFrancaKeys: readonly string[];
  readonly callerVerifiedHistoricLinguaFrancaNotices: readonly string[];
  readonly queryHistoricLinguaFrancaKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedHistoricLinguaFrancaKeys",
    label: "Caller verified historic lingua franca keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedHistoricLinguaFrancaNotices",
    label: "Caller verified historic lingua franca notices",
    kind: "stringList",
  },
  {
    id: "queryHistoricLinguaFrancaKey",
    label: "Query historic lingua franca key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedHistoricLinguaFrancaKeys,
      input.callerVerifiedHistoricLinguaFrancaNotices,
      input.queryHistoricLinguaFrancaKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedHistoricLinguaFrancaKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedHistoricLinguaFrancaNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryHistoricLinguaFrancaKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/lingua-franca-historic-period-lookup",
  title: "Historic Lingua Franca Period Lookup",
  description:
    "Independently verified regional/period lingua-franca evidence, not inferred official status. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedHistoricLinguaFrancaKeys:
        value.callerVerifiedHistoricLinguaFrancaKeys as readonly string[],
      callerVerifiedHistoricLinguaFrancaNotices:
        value.callerVerifiedHistoricLinguaFrancaNotices as readonly string[],
      queryHistoricLinguaFrancaKey:
        value.queryHistoricLinguaFrancaKey as string,
    }),
});
export const run = tool.execute;
export default tool;
