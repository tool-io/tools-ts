import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count } from "../shared.js";
export type Input = Readonly<{
  readonly lastCoveredYear: number;
  readonly callerClosureYearsAfterEndYear: number;
}>;
export type Output = Readonly<{
  readonly lastPolicyClosedYear: number;
  readonly firstPolicyOpenYear: number;
}>;
const inputFields = [
  { id: "lastCoveredYear", label: "Last covered year", kind: "integer" },
  {
    id: "callerClosureYearsAfterEndYear",
    label: "Caller closure years after end year",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  count(input.lastCoveredYear, "lastCoveredYear");
  count(input.callerClosureYearsAfterEndYear, "callerClosureYearsAfterEndYear");
  if (input.lastCoveredYear < 1000 || input.lastCoveredYear > 9999)
    simpleError("year", "Four-digit last covered year required.");
  const end = count(
    input.lastCoveredYear + input.callerClosureYearsAfterEndYear,
    "closedYear",
  );
  return {
    lastPolicyClosedYear: end,
    firstPolicyOpenYear: count(end + 1, "openYear"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  lastCoveredYear: 1950,
  callerClosureYearsAfterEndYear: 30,
} satisfies Input;
export const exampleOutput = {
  lastPolicyClosedYear: 1980,
  firstPolicyOpenYear: 1981,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/closure-end-year-calculator",
  title: "Access Restriction Closure Period End Year Calculator",
  description:
    "Resolve explicit whole-year closure policy including closure through final year and opening next year; no automatic privacy law, partial-date period or access-rights determination.",
  inputs: inputFields,
  outputs: [
    {
      id: "lastPolicyClosedYear",
      label: "Last policy closed year",
      kind: "number",
    },
    {
      id: "firstPolicyOpenYear",
      label: "First policy open year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      lastCoveredYear: value.lastCoveredYear as number,
      callerClosureYearsAfterEndYear:
        value.callerClosureYearsAfterEndYear as number,
    }),
});
export const run = tool.execute;
export default tool;
