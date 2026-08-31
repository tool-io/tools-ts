import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  money,
  sumMoney,
  weightedMinor,
  dateDay,
  nonnegative,
  aligned,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly tripDates: readonly string[];
  readonly tripDistancesMeters: readonly number[];
  readonly tripOtherExpensesMinor: readonly number[];
  readonly callerMileageRateMinorPerKm: number;
  readonly quarterStartDate: string;
}>;
export type Output = Readonly<{
  readonly inQuarterTripIndices: readonly number[];
  readonly quarterDistanceMeters: number;
  readonly quarterMileageReimbursementMinor: number;
  readonly quarterOtherExpensesMinor: number;
  readonly quarterTotalBeatExpenseMinor: number;
}>;
const inputFields = [
  { id: "tripDates", label: "Trip dates", kind: "stringList" },
  {
    id: "tripDistancesMeters",
    label: "Trip distances meters",
    kind: "numberList",
  },
  {
    id: "tripOtherExpensesMinor",
    label: "Trip other expenses minor",
    kind: "numberList",
  },
  {
    id: "callerMileageRateMinorPerKm",
    label: "Caller mileage rate minor per km",
    kind: "number",
  },
  { id: "quarterStartDate", label: "Quarter start date", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.tripDistancesMeters.forEach((v) =>
    nonnegative(v, "tripDistancesMeters"),
  );
  input.tripDistancesMeters.forEach((v) => integer(v, "tripDistancesMeters"));
  aligned(input.tripDates, input.tripDistancesMeters, "tripDates");
  aligned(input.tripDates, input.tripOtherExpensesMinor, "tripDates");
  money(input.callerMileageRateMinorPerKm, "rate");
  input.tripOtherExpensesMinor.forEach((v) => money(v, "expense"));
  if (
    !/^(?:19|20|21)[0-9]{2}-(?:01|04|07|10)-01$(?![\s\S])/.test(
      input.quarterStartDate,
    )
  )
    simpleError(
      "quarter",
      "Explicit Gregorian quarter-start ISO date required.",
    );
  const start = dateDay(input.quarterStartDate),
    parts = input.quarterStartDate.split("-").map(Number),
    end = Date.UTC(parts[0], parts[1] - 1 + 3, 1) / 86400000,
    indices = input.tripDates.flatMap((s, i) => {
      const d = dateDay(s);
      return d >= start && d < end ? [i] : [];
    }),
    distance = sumMoney(indices.map((i) => input.tripDistancesMeters[i])),
    mileage = sumMoney(
      indices.map((i) =>
        weightedMinor(
          input.tripDistancesMeters[i],
          input.callerMileageRateMinorPerKm,
          1000,
        ),
      ),
    ),
    other = sumMoney(indices.map((i) => input.tripOtherExpensesMinor[i]));
  return {
    inQuarterTripIndices: indices,
    quarterDistanceMeters: distance,
    quarterMileageReimbursementMinor: mileage,
    quarterOtherExpensesMinor: other,
    quarterTotalBeatExpenseMinor: sumMoney([mileage, other]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  tripDates: ["2025-01-01", "2025-04-01"],
  tripDistancesMeters: [1500, 2000],
  tripOtherExpensesMinor: [50, 80],
  callerMileageRateMinorPerKm: 100,
  quarterStartDate: "2025-01-01",
} satisfies Input;
export const exampleOutput = {
  inQuarterTripIndices: [0],
  quarterDistanceMeters: 1500,
  quarterMileageReimbursementMinor: 150,
  quarterOtherExpensesMinor: 50,
  quarterTotalBeatExpenseMinor: 200,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/beat-expense-mileage-log-quarter-total",
  title: "Beat Expense Mileage Log Quarter Total",
  description:
    "Audit actual quarter mileage/expense rows using caller minor-unit-per-km reimbursement, rounding each trip half-up and excluding exact next-quarter boundary; not tax mileage rates, travel entitlement or currency conversion.",
  inputs: inputFields,
  outputs: [
    {
      id: "inQuarterTripIndices",
      label: "In quarter trip indices",
      kind: "numberList",
    },
    {
      id: "quarterDistanceMeters",
      label: "Quarter distance meters",
      kind: "number",
    },
    {
      id: "quarterMileageReimbursementMinor",
      label: "Quarter mileage reimbursement minor",
      kind: "number",
    },
    {
      id: "quarterOtherExpensesMinor",
      label: "Quarter other expenses minor",
      kind: "number",
    },
    {
      id: "quarterTotalBeatExpenseMinor",
      label: "Quarter total beat expense minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      tripDates: value.tripDates as readonly string[],
      tripDistancesMeters: value.tripDistancesMeters as readonly number[],
      tripOtherExpensesMinor: value.tripOtherExpensesMinor as readonly number[],
      callerMileageRateMinorPerKm: value.callerMileageRateMinorPerKm as number,
      quarterStartDate: value.quarterStartDate as string,
    }),
});
export const run = tool.execute;
export default tool;
