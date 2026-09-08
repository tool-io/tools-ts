import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyVerifiedTapeManufactureYear: number;
  readonly callerReviewYear: number;
  readonly callerAgeReviewThresholdYears: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyVerifiedTapeManufactureYear",
    label: "Independently verified tape manufacture year",
    kind: "number",
  },
  { id: "callerReviewYear", label: "Caller review year", kind: "number" },
  {
    id: "callerAgeReviewThresholdYears",
    label: "Caller age review threshold years",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.independentlyVerifiedTapeManufactureYear,
    "manufacture",
    1,
    9999,
  );
  bounded(
    input.callerReviewYear,
    "review",
    input.independentlyVerifiedTapeManufactureYear,
    9999,
  );
  bounded(input.callerAgeReviewThresholdYears, "threshold", 0, 10000);
  return {
    observedTapeAgeYears:
      input.callerReviewYear - input.independentlyVerifiedTapeManufactureYear,
    meetsCallerAgeReviewScreen:
      input.callerReviewYear - input.independentlyVerifiedTapeManufactureYear >=
      input.callerAgeReviewThresholdYears,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyVerifiedTapeManufactureYear: 1990,
    callerReviewYear: 2026,
    callerAgeReviewThresholdYears: 20,
  },
  output: {
    result: { observedTapeAgeYears: 36, meetsCallerAgeReviewScreen: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/tape-hydrolysis-age-flag-checker",
  title: "Magnetic Tape Binder Hydrolysis Risk Age Flag Checker",
  description:
    "Actual tape age comparison with caller independently applicable review trigger only. Binder composition, storage and symptoms matter; age alone does not diagnose hydrolysis, authorize baking or guarantee playable/safe tape.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
