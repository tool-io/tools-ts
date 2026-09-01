import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  binary,
  unique,
  safeText,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerCoinRecordIds: readonly string[];
  readonly callerVerifiedMintYears: readonly number[];
  readonly callerCoinCountryIds: readonly string[];
  readonly callerVerifiedAvailableFlags: readonly number[];
  readonly queryBirthYear: number;
  readonly queryCountryId: string;
}>;
export type Output = Readonly<{
  readonly callerMatchingAvailableBirthdayCoinIds: readonly string[];
  readonly callerMatchingUnavailableBirthdayCoinIds: readonly string[];
}>;
const inputFields = [
  {
    id: "callerCoinRecordIds",
    label: "Caller coin record ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedMintYears",
    label: "Caller verified mint years",
    kind: "numberList",
  },
  {
    id: "callerCoinCountryIds",
    label: "Caller coin country ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedAvailableFlags",
    label: "Caller verified available flags",
    kind: "numberList",
  },
  { id: "queryBirthYear", label: "Query birth year", kind: "number" },
  { id: "queryCountryId", label: "Query country id", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerCoinRecordIds, "records");
  aligned(input.callerCoinRecordIds, input.callerVerifiedMintYears, "records");
  aligned(input.callerCoinRecordIds, input.callerCoinCountryIds, "records");
  aligned(
    input.callerCoinRecordIds,
    input.callerVerifiedAvailableFlags,
    "records",
  );
  binary(input.callerVerifiedAvailableFlags, "available");
  input.callerVerifiedMintYears.forEach((v) => bounded(v, "year", 1, 2199));
  bounded(input.queryBirthYear, "year", 1, 2199);
  safeText(input.queryCountryId, "country");
  input.callerCoinCountryIds.forEach((v) => safeText(v, "country"));
  const matches = input.callerCoinRecordIds
    .map((_, i) => i)
    .filter(
      (i) =>
        input.callerVerifiedMintYears[i] === input.queryBirthYear &&
        input.callerCoinCountryIds[i] === input.queryCountryId,
    );
  return {
    callerMatchingAvailableBirthdayCoinIds: matches
      .filter((i) => input.callerVerifiedAvailableFlags[i])
      .map((i) => input.callerCoinRecordIds[i]),
    callerMatchingUnavailableBirthdayCoinIds: matches
      .filter((i) => !input.callerVerifiedAvailableFlags[i])
      .map((i) => input.callerCoinRecordIds[i]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCoinRecordIds: ["a", "b", "c"],
  callerVerifiedMintYears: [1990, 1991, 1990],
  callerCoinCountryIds: ["x", "x", "y"],
  callerVerifiedAvailableFlags: [1, 0, 1],
  queryBirthYear: 1990,
  queryCountryId: "x",
} satisfies Input;
export const exampleOutput = {
  callerMatchingAvailableBirthdayCoinIds: ["a"],
  callerMatchingUnavailableBirthdayCoinIds: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/year-set-birthday-coin-finder",
  title: "Year Set Birthday Coin Finder",
  description:
    "Find actual caller coin-record year/country matches with independently verified availability, rather than numeric collection-completion percent; no inferred issue existence, sale recommendation or calendar-era conversion.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchingAvailableBirthdayCoinIds",
      label: "Caller matching available birthday coin ids",
      kind: "stringList",
    },
    {
      id: "callerMatchingUnavailableBirthdayCoinIds",
      label: "Caller matching unavailable birthday coin ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerCoinRecordIds: value.callerCoinRecordIds as readonly string[],
      callerVerifiedMintYears:
        value.callerVerifiedMintYears as readonly number[],
      callerCoinCountryIds: value.callerCoinCountryIds as readonly string[],
      callerVerifiedAvailableFlags:
        value.callerVerifiedAvailableFlags as readonly number[],
      queryBirthYear: value.queryBirthYear as number,
      queryCountryId: value.queryCountryId as string,
    }),
});
export const run = tool.execute;
export default tool;
