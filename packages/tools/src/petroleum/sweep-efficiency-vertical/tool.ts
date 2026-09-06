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
  readonly observedAssessedVerticalExposureM: readonly number[];
  readonly observedContactedVerticalExposureM: readonly number[];
  readonly observedUnassessedVerticalExposureM: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownSweepFraction: number;
  readonly wholeSweepLowerBound: number;
  readonly wholeSweepUpperBound: number;
}>;
const inputFields = [
  {
    id: "observedAssessedVerticalExposureM",
    label: "Observed assessed vertical exposure m",
    kind: "numberList",
  },
  {
    id: "observedContactedVerticalExposureM",
    label: "Observed contacted vertical exposure m",
    kind: "numberList",
  },
  {
    id: "observedUnassessedVerticalExposureM",
    label: "Observed unassessed vertical exposure m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedAssessedVerticalExposureM.forEach((v) =>
    positive(v, "observedAssessedVerticalExposureM"),
  );
  input.observedContactedVerticalExposureM.forEach((v) =>
    nonnegative(v, "observedContactedVerticalExposureM"),
  );
  input.observedUnassessedVerticalExposureM.forEach((v) =>
    nonnegative(v, "observedUnassessedVerticalExposureM"),
  );
  aligned(
    input.observedAssessedVerticalExposureM,
    input.observedContactedVerticalExposureM,
    "observedAssessedVerticalExposureM",
  );
  aligned(
    input.observedAssessedVerticalExposureM,
    input.observedUnassessedVerticalExposureM,
    "observedAssessedVerticalExposureM",
  );
  input.observedContactedVerticalExposureM.forEach((v, i) => {
    if (v > input.observedAssessedVerticalExposureM[i])
      simpleError("contacted", "Observed contacted≤assessed exposure.");
  });
  const known = sum(input.observedAssessedVerticalExposureM),
    contacted = sum(input.observedContactedVerticalExposureM),
    unknown = sum(input.observedUnassessedVerticalExposureM);
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
  observedAssessedVerticalExposureM: [2, 3],
  observedContactedVerticalExposureM: [1, 3],
  observedUnassessedVerticalExposureM: [1, 1],
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
  id: "petroleum/sweep-efficiency-vertical",
  title: "Petroleum Sweep Efficiency Vertical Calculator",
  description:
    "Audit actual independently tracer-assessed vertical sweep exposure with unavailable whole-inventory bounds, not assumed areal×vertical independence or displacement efficiency. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedAssessedVerticalExposureM:
        value.observedAssessedVerticalExposureM as readonly number[],
      observedContactedVerticalExposureM:
        value.observedContactedVerticalExposureM as readonly number[],
      observedUnassessedVerticalExposureM:
        value.observedUnassessedVerticalExposureM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
