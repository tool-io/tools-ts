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
  catalogIndex,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerCountryCodes: readonly string[];
  readonly callerIbanLengths: readonly number[];
  readonly callerBbanRegexSources: readonly string[];
  readonly iban: string;
}>;
export type Output = Readonly<{
  readonly callerCountryLength: number;
  readonly lengthMatchesCallerCountry: boolean;
  readonly bbanMatchesCallerFormat: boolean;
}>;
const inputFields = [
  {
    id: "callerCountryCodes",
    label: "Caller country codes",
    kind: "stringList",
  },
  { id: "callerIbanLengths", label: "Caller iban lengths", kind: "numberList" },
  {
    id: "callerBbanRegexSources",
    label: "Caller bban regex sources",
    kind: "stringList",
  },
  { id: "iban", label: "Iban", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerCountryCodes, "countries");
  aligned(input.callerCountryCodes, input.callerIbanLengths, "lengths");
  aligned(input.callerCountryCodes, input.callerBbanRegexSources, "formats");
  if (
    input.callerCountryCodes.some((s) => !/^[A-Z]{2}$(?![\s\S])/.test(s)) ||
    !/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$(?![\s\S])/.test(input.iban)
  )
    simpleError("IBAN", "Canonical caller country/IBAN notation required.");
  input.callerIbanLengths.forEach((v) => bounded(v, "length", 15, 34));
  if (
    input.callerBbanRegexSources.some(
      (s) =>
        !/^\[(?:A-Z|0-9|A-Z0-9)\]\{[1-9][0-9]?\}(?:\[(?:A-Z|0-9|A-Z0-9)\]\{[1-9][0-9]?\}){0,7}$(?![\s\S])/.test(
          s,
        ),
    )
  )
    simpleError(
      "format",
      "Bounded concatenated ASCII range-and-fixed-count BBAN grammar required, not arbitrary regex.",
    );
  const i = catalogIndex(input.callerCountryCodes, input.iban.slice(0, 2));
  return {
    callerCountryLength: input.callerIbanLengths[i],
    lengthMatchesCallerCountry:
      input.iban.length === input.callerIbanLengths[i],
    bbanMatchesCallerFormat: new RegExp(
      "^(?:" + input.callerBbanRegexSources[i] + ")$(?![\\s\\S])",
    ).test(input.iban.slice(4)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCountryCodes: ["GB", "DE"],
  callerIbanLengths: [22, 22],
  callerBbanRegexSources: ["[A-Z]{4}[0-9]{14}", "[0-9]{18}"],
  iban: "GB82WEST12345698765432",
} satisfies Input;
export const exampleOutput = {
  callerCountryLength: 22,
  lengthMatchesCallerCountry: true,
  bbanMatchesCallerFormat: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/iban-country-length-format-lookup",
  title: "IBAN Country Length Format Lookup",
  description:
    "Audit caller verified country BBAN format/length independently from mod97 checksum, safe restricted fixed-width regex grammar and no issued-account inference. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerCountryLength",
      label: "Caller country length",
      kind: "number",
    },
    {
      id: "lengthMatchesCallerCountry",
      label: "Length matches caller country",
      kind: "boolean",
    },
    {
      id: "bbanMatchesCallerFormat",
      label: "Bban matches caller format",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerCountryCodes: value.callerCountryCodes as readonly string[],
      callerIbanLengths: value.callerIbanLengths as readonly number[],
      callerBbanRegexSources: value.callerBbanRegexSources as readonly string[],
      iban: value.iban as string,
    }),
});
export const run = tool.execute;
export default tool;
