import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integer,
  aligned,
  sum,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedMummyCounts: readonly number[];
  readonly observedInspectedBroodCounts: readonly number[];
  readonly callerSeverityMinimumPer100: number;
}>;
export type Output = Readonly<{
  readonly observedMummiesPer100Brood: number;
  readonly callerMonitoringThresholdReached: boolean;
}>;
const inputFields = [
  {
    id: "observedMummyCounts",
    label: "Observed mummy counts",
    kind: "numberList",
  },
  {
    id: "observedInspectedBroodCounts",
    label: "Observed inspected brood counts",
    kind: "numberList",
  },
  {
    id: "callerSeverityMinimumPer100",
    label: "Caller severity minimum per100",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedInspectedBroodCounts.forEach((v) =>
    positive(v, "observedInspectedBroodCounts"),
  );
  input.observedMummyCounts.forEach((v) =>
    nonnegative(v, "observedMummyCounts"),
  );
  nonnegative(input.callerSeverityMinimumPer100, "callerSeverityMinimumPer100");
  aligned(
    input.observedMummyCounts,
    input.observedInspectedBroodCounts,
    "observedMummyCounts",
  );
  [...input.observedMummyCounts, ...input.observedInspectedBroodCounts].forEach(
    (v) => integer(v, "count"),
  );
  input.observedMummyCounts.forEach((v, i) => {
    if (v > input.observedInspectedBroodCounts[i])
      simpleError("counts", "Mummies≤inspected brood.");
  });
  const r =
    (100 * sum(input.observedMummyCounts)) /
    sum(input.observedInspectedBroodCounts);
  return {
    observedMummiesPer100Brood: r,
    callerMonitoringThresholdReached: r >= input.callerSeverityMinimumPer100,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMummyCounts: [2, 3],
  observedInspectedBroodCounts: [100, 100],
  callerSeverityMinimumPer100: 2,
} satisfies Input;
export const exampleOutput = {
  observedMummiesPer100Brood: 2.5,
  callerMonitoringThresholdReached: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/chalkbrood-mummy-count-severity",
  title: "Chalkbrood Mummy Count Severity Classifier",
  description:
    "Actual independently identified chalkbrood mummy/inspected-brood count screen against caller protocol threshold, no colony diagnosis or treatment. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedMummiesPer100Brood",
      label: "Observed mummies per100 brood",
      kind: "number",
    },
    {
      id: "callerMonitoringThresholdReached",
      label: "Caller monitoring threshold reached",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMummyCounts: value.observedMummyCounts as readonly number[],
      observedInspectedBroodCounts:
        value.observedInspectedBroodCounts as readonly number[],
      callerSeverityMinimumPer100: value.callerSeverityMinimumPer100 as number,
    }),
});
export const run = tool.execute;
export default tool;
