import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, catalog, money } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerAutoClassIds: readonly string[];
  readonly callerBaseAnnualPremiumMinor: readonly number[];
  readonly queryAutoClassId: string;
  readonly observedQuotedBasePremiumMinor: number;
}>;
export type Output = Readonly<{
  readonly callerClassBasePremiumMinor: number;
  readonly signedQuotedBasePremiumDifferenceMinor: number;
}>;
const inputFields = [
  {
    id: "callerAutoClassIds",
    label: "Caller auto class ids",
    kind: "stringList",
  },
  {
    id: "callerBaseAnnualPremiumMinor",
    label: "Caller base annual premium minor",
    kind: "numberList",
  },
  { id: "queryAutoClassId", label: "Query auto class id", kind: "string" },
  {
    id: "observedQuotedBasePremiumMinor",
    label: "Observed quoted base premium minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerBaseAnnualPremiumMinor.forEach((v) => money(v));
  money(input.observedQuotedBasePremiumMinor);
  const base = catalog(
    input.callerAutoClassIds,
    input.callerBaseAnnualPremiumMinor,
    input.queryAutoClassId,
  );
  return {
    callerClassBasePremiumMinor: base,
    signedQuotedBasePremiumDifferenceMinor:
      input.observedQuotedBasePremiumMinor - base,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAutoClassIds: ["a", "b"],
  callerBaseAnnualPremiumMinor: [10000, 20000],
  queryAutoClassId: "a",
  observedQuotedBasePremiumMinor: 11000,
} satisfies Input;
export const exampleOutput = {
  callerClassBasePremiumMinor: 10000,
  signedQuotedBasePremiumDifferenceMinor: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/auto-premium-base-class-lookup",
  title: "Auto Premium Base Class Lookup",
  description:
    "Audit actual auto base-class quote against caller independently verified annual class rate catalog in one currency; no universal insurer classes/rates or underwriting decision.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerClassBasePremiumMinor",
      label: "Caller class base premium minor",
      kind: "number",
    },
    {
      id: "signedQuotedBasePremiumDifferenceMinor",
      label: "Signed quoted base premium difference minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerAutoClassIds: value.callerAutoClassIds as readonly string[],
      callerBaseAnnualPremiumMinor:
        value.callerBaseAnnualPremiumMinor as readonly number[],
      queryAutoClassId: value.queryAutoClassId as string,
      observedQuotedBasePremiumMinor:
        value.observedQuotedBasePremiumMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
