import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, dateDay, literal } from "../batch-shared.js";
export type Input = Readonly<{
  readonly callerConceptPeriodType: string;
  readonly contextStartDate: string;
  readonly contextEndOrInstantDate: string;
}>;
export type Output = Readonly<{
  readonly xbrlPeriodElementNames: readonly string[];
  readonly xbrlPeriodElementValues: readonly string[];
  readonly inclusiveCivilDateCount: number;
}>;
const inputFields = [
  {
    id: "callerConceptPeriodType",
    label: "Caller concept period type",
    kind: "string",
  },
  { id: "contextStartDate", label: "Context start date", kind: "string" },
  {
    id: "contextEndOrInstantDate",
    label: "Context end or instant date",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  literal(input.callerConceptPeriodType, ["instant", "duration"], "periodType");
  const end = dateDay(input.contextEndOrInstantDate);
  if (input.callerConceptPeriodType === "instant") {
    if (input.contextStartDate !== "")
      simpleError(
        "startDate",
        "Instant context requires an explicitly empty start field.",
      );
    return {
      xbrlPeriodElementNames: ["instant"],
      xbrlPeriodElementValues: [input.contextEndOrInstantDate],
      inclusiveCivilDateCount: 1,
    };
  }
  const start = dateDay(input.contextStartDate);
  if (start > end) simpleError("dates", "Duration start must not exceed end.");
  return {
    xbrlPeriodElementNames: ["startDate", "endDate"],
    xbrlPeriodElementValues: [
      input.contextStartDate,
      input.contextEndOrInstantDate,
    ],
    inclusiveCivilDateCount: end - start + 1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerConceptPeriodType: "duration",
  contextStartDate: "2025-01-01",
  contextEndOrInstantDate: "2025-12-31",
} satisfies Input;
export const exampleOutput = {
  xbrlPeriodElementNames: ["startDate", "endDate"],
  xbrlPeriodElementValues: ["2025-01-01", "2025-12-31"],
  inclusiveCivilDateCount: 365,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/xbrl-tag-context-period-type-selector-lookup",
  title: "XBRL Tag Context Period Type Selector Lookup",
  description:
    "Build XBRL civil-date period elements from caller taxonomy instant/duration metadata, rejecting inconsistent start field; not concept identification, XML serialization, taxonomy validation or time-zone/dateTime context semantics.",
  inputs: inputFields,
  outputs: [
    {
      id: "xbrlPeriodElementNames",
      label: "Xbrl period element names",
      kind: "stringList",
    },
    {
      id: "xbrlPeriodElementValues",
      label: "Xbrl period element values",
      kind: "stringList",
    },
    {
      id: "inclusiveCivilDateCount",
      label: "Inclusive civil date count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerConceptPeriodType: value.callerConceptPeriodType as string,
      contextStartDate: value.contextStartDate as string,
      contextEndOrInstantDate: value.contextEndOrInstantDate as string,
    }),
});
export const run = tool.execute;
export default tool;
