import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  unique,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly callerCountryCodes: readonly string[];
  readonly callerMinimumLengths: readonly number[];
  readonly callerMaximumLengths: readonly number[];
  readonly selectedCountryCode: string;
  readonly accountNumberText: string;
}>;
export type Output = Readonly<{
  readonly callerCountryPolicyFound: boolean;
  readonly observedAccountDigitLength: number;
  readonly minimumDeclaredAccountLength: number;
  readonly maximumDeclaredAccountLength: number;
  readonly withinCallerCountryLengthPolicy: boolean;
}>;
const inputFields = [
  {
    id: "callerCountryCodes",
    label: "Caller country codes",
    kind: "stringList",
  },
  {
    id: "callerMinimumLengths",
    label: "Caller minimum lengths",
    kind: "numberList",
  },
  {
    id: "callerMaximumLengths",
    label: "Caller maximum lengths",
    kind: "numberList",
  },
  { id: "selectedCountryCode", label: "Selected country code", kind: "string" },
  { id: "accountNumberText", label: "Account number text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerCountryCodes,
    input.callerMinimumLengths,
    "callerCountryCodes",
  );
  aligned(
    input.callerCountryCodes,
    input.callerMaximumLengths,
    "callerCountryCodes",
  );
  unique(input.callerCountryCodes, "countries");
  if (
    input.callerCountryCodes.some((s) => !/^[A-Z]{2}$(?![\s\S])/.test(s)) ||
    !/^[A-Z]{2}$(?![\s\S])/.test(input.selectedCountryCode) ||
    !/^[0-9]{1,128}$(?![\s\S])/.test(input.accountNumberText)
  )
    simpleError(
      "notation",
      "Two-letter caller country labels and exact bounded ASCII account digits required.",
    );
  input.callerMinimumLengths.forEach((v, i) => {
    bounded(v, "minimum", 1, 128);
    bounded(input.callerMaximumLengths[i], "maximum", v, 128);
  });
  const i = input.callerCountryCodes.indexOf(input.selectedCountryCode),
    n = input.accountNumberText.length;
  return {
    callerCountryPolicyFound: i >= 0,
    observedAccountDigitLength: n,
    minimumDeclaredAccountLength: i >= 0 ? input.callerMinimumLengths[i] : -1,
    maximumDeclaredAccountLength: i >= 0 ? input.callerMaximumLengths[i] : -1,
    withinCallerCountryLengthPolicy:
      i >= 0 &&
      n >= input.callerMinimumLengths[i] &&
      n <= input.callerMaximumLengths[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCountryCodes: ["AA", "BB"],
  callerMinimumLengths: [6, 8],
  callerMaximumLengths: [8, 10],
  selectedCountryCode: "AA",
  accountNumberText: "000123",
} satisfies Input;
export const exampleOutput = {
  callerCountryPolicyFound: true,
  observedAccountDigitLength: 6,
  minimumDeclaredAccountLength: 6,
  maximumDeclaredAccountLength: 8,
  withinCallerCountryLengthPolicy: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/account-number-length-country-lookup",
  title: "Account Number Length Country Lookup",
  description:
    "Audit observed account digit length against explicit versioned caller country/bank policy table; absent country remains unavailable, not an invented universal national account length or IBAN validation.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerCountryPolicyFound",
      label: "Caller country policy found",
      kind: "boolean",
    },
    {
      id: "observedAccountDigitLength",
      label: "Observed account digit length",
      kind: "number",
    },
    {
      id: "minimumDeclaredAccountLength",
      label: "Minimum declared account length",
      kind: "number",
    },
    {
      id: "maximumDeclaredAccountLength",
      label: "Maximum declared account length",
      kind: "number",
    },
    {
      id: "withinCallerCountryLengthPolicy",
      label: "Within caller country length policy",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerCountryCodes: value.callerCountryCodes as readonly string[],
      callerMinimumLengths: value.callerMinimumLengths as readonly number[],
      callerMaximumLengths: value.callerMaximumLengths as readonly number[],
      selectedCountryCode: value.selectedCountryCode as string,
      accountNumberText: value.accountNumberText as string,
    }),
});
export const run = tool.execute;
export default tool;
