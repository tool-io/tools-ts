import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedCompactionLiftAreasM2: readonly number[];
  readonly callerVerifiedMaximumAreaPerTestM2: readonly number[];
  readonly callerMinimumTestsEachLift: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerScheduledCompactionTestsPerLift: readonly number[];
  readonly callerScheduledTotalCompactionTests: number;
}>;
const inputFields = [
  {
    id: "observedCompactionLiftAreasM2",
    label: "Observed compaction lift areas m2",
    kind: "numberList",
  },
  {
    id: "callerVerifiedMaximumAreaPerTestM2",
    label: "Caller verified maximum area per test m2",
    kind: "numberList",
  },
  {
    id: "callerMinimumTestsEachLift",
    label: "Caller minimum tests each lift",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedCompactionLiftAreasM2.forEach((v) =>
    positive(v, "observedCompactionLiftAreasM2"),
  );
  input.callerVerifiedMaximumAreaPerTestM2.forEach((v) =>
    positive(v, "callerVerifiedMaximumAreaPerTestM2"),
  );
  input.callerMinimumTestsEachLift.forEach((v) =>
    nonnegative(v, "callerMinimumTestsEachLift"),
  );
  aligned(
    input.observedCompactionLiftAreasM2,
    input.callerVerifiedMaximumAreaPerTestM2,
    "observedCompactionLiftAreasM2",
  );
  aligned(
    input.observedCompactionLiftAreasM2,
    input.callerMinimumTestsEachLift,
    "observedCompactionLiftAreasM2",
  );
  input.callerMinimumTestsEachLift.forEach((v) =>
    bounded(v, "minimum", 0, 1000000),
  );
  const counts = input.observedCompactionLiftAreasM2.map((v, i) =>
    Math.max(
      input.callerMinimumTestsEachLift[i],
      Math.ceil(v / input.callerVerifiedMaximumAreaPerTestM2[i]),
    ),
  );
  counts.forEach((v) => bounded(v, "test count", 0, 1000000));
  return {
    callerScheduledCompactionTestsPerLift: counts,
    callerScheduledTotalCompactionTests: sum(counts),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCompactionLiftAreasM2: [10, 21],
  callerVerifiedMaximumAreaPerTestM2: [10, 10],
  callerMinimumTestsEachLift: [2, 2],
} satisfies Input;
export const exampleOutput = {
  callerScheduledCompactionTestsPerLift: [2, 3],
  callerScheduledTotalCompactionTests: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/site-compaction-test-frequency",
  title: "Compaction Test Frequency Calculator",
  description:
    "Per-observed-lift area/minimum-frequency schedule with caller independently verified project policy, distinct from concrete volume/sample sets and no compaction acceptance. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerScheduledCompactionTestsPerLift",
      label: "Caller scheduled compaction tests per lift",
      kind: "numberList",
    },
    {
      id: "callerScheduledTotalCompactionTests",
      label: "Caller scheduled total compaction tests",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCompactionLiftAreasM2:
        value.observedCompactionLiftAreasM2 as readonly number[],
      callerVerifiedMaximumAreaPerTestM2:
        value.callerVerifiedMaximumAreaPerTestM2 as readonly number[],
      callerMinimumTestsEachLift:
        value.callerMinimumTestsEachLift as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
