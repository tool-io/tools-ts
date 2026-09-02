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
  readonly observedCalibrationBeeCounts: readonly number[];
  readonly observedMatchedHalfCupFractions: readonly number[];
  readonly queryHalfCupFraction: number;
}>;
export type Output = Readonly<{
  readonly conditionalVolumeEstimatedBeeCount: number;
}>;
const inputFields = [
  {
    id: "observedCalibrationBeeCounts",
    label: "Observed calibration bee counts",
    kind: "numberList",
  },
  {
    id: "observedMatchedHalfCupFractions",
    label: "Observed matched half cup fractions",
    kind: "numberList",
  },
  {
    id: "queryHalfCupFraction",
    label: "Query half cup fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedCalibrationBeeCounts.forEach((v) =>
    positive(v, "observedCalibrationBeeCounts"),
  );
  input.observedMatchedHalfCupFractions.forEach((v) =>
    positive(v, "observedMatchedHalfCupFractions"),
  );
  nonnegative(input.queryHalfCupFraction, "queryHalfCupFraction");
  aligned(
    input.observedCalibrationBeeCounts,
    input.observedMatchedHalfCupFractions,
    "calibration",
  );
  input.observedCalibrationBeeCounts.forEach((v) => integer(v, "bees"));
  const density =
    sum(input.observedCalibrationBeeCounts) /
    sum(input.observedMatchedHalfCupFractions);
  if (
    input.observedCalibrationBeeCounts.length !==
    input.observedMatchedHalfCupFractions.length
  )
    simpleError(
      "calibration",
      "Matched measured bee counts and volume fractions.",
    );
  return {
    conditionalVolumeEstimatedBeeCount: density * input.queryHalfCupFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCalibrationBeeCounts: [100, 200],
  observedMatchedHalfCupFractions: [0.5, 1],
  queryHalfCupFraction: 0.75,
} satisfies Input;
export const exampleOutput = {
  conditionalVolumeEstimatedBeeCount: 150,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/mite-wash-half-cup-bee-count",
  title: "Mite Wash Half Cup Bee Count Tool",
  description:
    "Actual sampled packing calibration for caller explicit half-cup volume convention; no universal300 bees/half-cup or infestation count denominator accuracy guarantee. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalVolumeEstimatedBeeCount",
      label: "Conditional volume estimated bee count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCalibrationBeeCounts:
        value.observedCalibrationBeeCounts as readonly number[],
      observedMatchedHalfCupFractions:
        value.observedMatchedHalfCupFractions as readonly number[],
      queryHalfCupFraction: value.queryHalfCupFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
