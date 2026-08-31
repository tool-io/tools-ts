import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  dateDay,
  bounded,
  aligned,
  binary,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly articleReadIds: readonly string[];
  readonly readCivilDates: readonly string[];
  readonly callerMeterEligibleFlags: readonly number[];
  readonly callerMeterMonth: string;
  readonly callerMonthlyDistinctArticleAllowance: number;
}>;
export type Output = Readonly<{
  readonly distinctMeteredArticleIds: readonly string[];
  readonly observedDistinctMeteredArticleCount: number;
  readonly remainingDistinctArticleAllowance: number;
  readonly allowanceAlreadyExceeded: boolean;
}>;
const inputFields = [
  { id: "articleReadIds", label: "Article read ids", kind: "stringList" },
  { id: "readCivilDates", label: "Read civil dates", kind: "stringList" },
  {
    id: "callerMeterEligibleFlags",
    label: "Caller meter eligible flags",
    kind: "numberList",
  },
  { id: "callerMeterMonth", label: "Caller meter month", kind: "string" },
  {
    id: "callerMonthlyDistinctArticleAllowance",
    label: "Caller monthly distinct article allowance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(input.callerMeterEligibleFlags, "callerMeterEligibleFlags");
  aligned(input.articleReadIds, input.readCivilDates, "articleReadIds");
  aligned(
    input.articleReadIds,
    input.callerMeterEligibleFlags,
    "articleReadIds",
  );
  if (
    !/^(?:19|20|21)[0-9]{2}-(?:0[1-9]|1[0-2])$(?![\s\S])/.test(
      input.callerMeterMonth,
    ) ||
    input.articleReadIds.some((s) => !s.trim())
  )
    simpleError(
      "meter",
      "Exact caller civil month and nonempty article identities required.",
    );
  bounded(input.callerMonthlyDistinctArticleAllowance, "allowance", 0, 1000000);
  input.readCivilDates.forEach(dateDay);
  const ids = [
    ...new Set(
      input.articleReadIds.filter(
        (_, i) =>
          input.callerMeterEligibleFlags[i] === 1 &&
          input.readCivilDates[i].slice(0, 7) === input.callerMeterMonth,
      ),
    ),
  ];
  return {
    distinctMeteredArticleIds: ids,
    observedDistinctMeteredArticleCount: ids.length,
    remainingDistinctArticleAllowance: Math.max(
      0,
      input.callerMonthlyDistinctArticleAllowance - ids.length,
    ),
    allowanceAlreadyExceeded:
      ids.length > input.callerMonthlyDistinctArticleAllowance,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  articleReadIds: ["a", "a", "b", "c"],
  readCivilDates: ["2025-01-01", "2025-01-02", "2025-01-31", "2025-02-01"],
  callerMeterEligibleFlags: [1, 1, 1, 1],
  callerMeterMonth: "2025-01",
  callerMonthlyDistinctArticleAllowance: 2,
} satisfies Input;
export const exampleOutput = {
  distinctMeteredArticleIds: ["a", "b"],
  observedDistinctMeteredArticleCount: 2,
  remainingDistinctArticleAllowance: 0,
  allowanceAlreadyExceeded: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/paywall-metered-article-count-monthly-tracker",
  title: "Paywall Metered Article Count Monthly Tracker",
  description:
    "Audit actual caller eligible article reads by explicit civil month, counting repeat reads of one article once; month time-zone resolution, account identity and publisher exemptions remain caller policy, not a universal paywall rule.",
  inputs: inputFields,
  outputs: [
    {
      id: "distinctMeteredArticleIds",
      label: "Distinct metered article ids",
      kind: "stringList",
    },
    {
      id: "observedDistinctMeteredArticleCount",
      label: "Observed distinct metered article count",
      kind: "number",
    },
    {
      id: "remainingDistinctArticleAllowance",
      label: "Remaining distinct article allowance",
      kind: "number",
    },
    {
      id: "allowanceAlreadyExceeded",
      label: "Allowance already exceeded",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      articleReadIds: value.articleReadIds as readonly string[],
      readCivilDates: value.readCivilDates as readonly string[],
      callerMeterEligibleFlags:
        value.callerMeterEligibleFlags as readonly number[],
      callerMeterMonth: value.callerMeterMonth as string,
      callerMonthlyDistinctArticleAllowance:
        value.callerMonthlyDistinctArticleAllowance as number,
    }),
});
export const run = tool.execute;
export default tool;
