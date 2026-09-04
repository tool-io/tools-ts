import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  binary,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedPreviousCorkStripYears: readonly number[];
  readonly asOfYear: number;
  readonly callerMinimumStripIntervalYears: number;
  readonly callerIndependentEligibilityFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly elapsedCorkStripYears: readonly number[];
  readonly callerEligibleIntervalAndEvidenceFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "observedPreviousCorkStripYears",
    label: "Observed previous cork strip years",
    kind: "numberList",
  },
  { id: "asOfYear", label: "As of year", kind: "number" },
  {
    id: "callerMinimumStripIntervalYears",
    label: "Caller minimum strip interval years",
    kind: "number",
  },
  {
    id: "callerIndependentEligibilityFlags",
    label: "Caller independent eligibility flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.asOfYear, "year", 1900, 2199);
  bounded(input.callerMinimumStripIntervalYears, "interval", 1, 100);
  aligned(
    input.observedPreviousCorkStripYears,
    input.callerIndependentEligibilityFlags,
    "trees",
  );
  binary(input.callerIndependentEligibilityFlags, "evidence");
  input.observedPreviousCorkStripYears.forEach((v) =>
    bounded(v, "year", 1900, input.asOfYear),
  );
  const elapsed = input.observedPreviousCorkStripYears.map(
    (v) => input.asOfYear - v,
  );
  return {
    elapsedCorkStripYears: elapsed,
    callerEligibleIntervalAndEvidenceFlags: elapsed.map((v, i) =>
      v >= input.callerMinimumStripIntervalYears &&
      input.callerIndependentEligibilityFlags[i]
        ? 1
        : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPreviousCorkStripYears: [2000, 2010],
  asOfYear: 2020,
  callerMinimumStripIntervalYears: 9,
  callerIndependentEligibilityFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  elapsedCorkStripYears: [20, 10],
  callerEligibleIntervalAndEvidenceFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/cork-oak-strip-harvest-cycle-nine-year-checker",
  title: "Cork Oak Nine-Year Strip Harvest Cycle Checker",
  description:
    "Audit caller cork interval (nine-year example) plus independently verified eligibility, interval alone not tree readiness, permission or stripping prescription. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "elapsedCorkStripYears",
      label: "Elapsed cork strip years",
      kind: "numberList",
    },
    {
      id: "callerEligibleIntervalAndEvidenceFlags",
      label: "Caller eligible interval and evidence flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPreviousCorkStripYears:
        value.observedPreviousCorkStripYears as readonly number[],
      asOfYear: value.asOfYear as number,
      callerMinimumStripIntervalYears:
        value.callerMinimumStripIntervalYears as number,
      callerIndependentEligibilityFlags:
        value.callerIndependentEligibilityFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
