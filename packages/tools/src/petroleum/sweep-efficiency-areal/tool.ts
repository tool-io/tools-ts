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
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedAssessedArealExposureM2: readonly number[];
  readonly observedContactedArealExposureM2: readonly number[];
  readonly observedUnassessedArealExposureM2: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownSweepFraction: number;
  readonly wholeSweepLowerBound: number;
  readonly wholeSweepUpperBound: number;
}>;
const inputFields = [
  {
    id: "observedAssessedArealExposureM2",
    label: "Observed assessed areal exposure m2",
    kind: "numberList",
  },
  {
    id: "observedContactedArealExposureM2",
    label: "Observed contacted areal exposure m2",
    kind: "numberList",
  },
  {
    id: "observedUnassessedArealExposureM2",
    label: "Observed unassessed areal exposure m2",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedAssessedArealExposureM2.forEach((v) =>
    positive(v, "observedAssessedArealExposureM2"),
  );
  input.observedContactedArealExposureM2.forEach((v) =>
    nonnegative(v, "observedContactedArealExposureM2"),
  );
  input.observedUnassessedArealExposureM2.forEach((v) =>
    nonnegative(v, "observedUnassessedArealExposureM2"),
  );
  aligned(
    input.observedAssessedArealExposureM2,
    input.observedContactedArealExposureM2,
    "observedAssessedArealExposureM2",
  );
  aligned(
    input.observedAssessedArealExposureM2,
    input.observedUnassessedArealExposureM2,
    "observedAssessedArealExposureM2",
  );
  input.observedContactedArealExposureM2.forEach((v, i) => {
    if (v > input.observedAssessedArealExposureM2[i])
      simpleError("contacted", "Observed contacted≤assessed exposure.");
  });
  const known = sum(input.observedAssessedArealExposureM2),
    contacted = sum(input.observedContactedArealExposureM2),
    unknown = sum(input.observedUnassessedArealExposureM2);
  return {
    knownSweepFraction: contacted / known,
    wholeSweepLowerBound: contacted / (known + unknown),
    wholeSweepUpperBound: (contacted + unknown) / (known + unknown),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAssessedArealExposureM2: [2, 3],
  observedContactedArealExposureM2: [1, 3],
  observedUnassessedArealExposureM2: [1, 1],
} satisfies Input;
export const exampleOutput = {
  knownSweepFraction: 0.8,
  wholeSweepLowerBound: 0.5714285714285714,
  wholeSweepUpperBound: 0.8571428571428571,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/sweep-efficiency-areal",
  title: "Petroleum Sweep Efficiency Areal Calculator",
  description:
    "Audit actual independently tracer-assessed areal sweep exposure with unavailable whole-inventory bounds, not assumed areal×vertical independence or displacement efficiency. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    { id: "knownSweepFraction", label: "Known sweep fraction", kind: "number" },
    {
      id: "wholeSweepLowerBound",
      label: "Whole sweep lower bound",
      kind: "number",
    },
    {
      id: "wholeSweepUpperBound",
      label: "Whole sweep upper bound",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAssessedArealExposureM2:
        value.observedAssessedArealExposureM2 as readonly number[],
      observedContactedArealExposureM2:
        value.observedContactedArealExposureM2 as readonly number[],
      observedUnassessedArealExposureM2:
        value.observedUnassessedArealExposureM2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
