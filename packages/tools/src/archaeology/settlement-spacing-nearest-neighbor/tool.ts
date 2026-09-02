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
  mean,
  shape,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedSettlementPlanarPositionsMeters: readonly (readonly number[])[];
  readonly callerStudyWindowAreaM2: number;
}>;
export type Output = Readonly<{
  readonly observedMeanNearestNeighborMeters: number;
  readonly poissonExpectedNearestNeighborMeters: number;
  readonly nearestNeighborIndex: number;
}>;
const inputFields = [
  {
    id: "observedSettlementPlanarPositionsMeters",
    label: "Observed settlement planar positions meters",
    kind: "matrix",
  },
  {
    id: "callerStudyWindowAreaM2",
    label: "Caller study window area m2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerStudyWindowAreaM2, "callerStudyWindowAreaM2");
  if (
    input.observedSettlementPlanarPositionsMeters.length < 2 ||
    shape(input.observedSettlementPlanarPositionsMeters, "points") !== 2
  )
    simpleError("points", "At least 2localplanarsettlementpoints.");
  const pts = input.observedSettlementPlanarPositionsMeters,
    n = pts.length,
    observed = mean(
      pts.map((v, i) =>
        Math.min(
          ...pts.flatMap((w, j) =>
            i === j ? [] : [Math.hypot(v[0] - w[0], v[1] - w[1])],
          ),
        ),
      ),
    ),
    expected = 0.5 / Math.sqrt(n / input.callerStudyWindowAreaM2);
  return {
    observedMeanNearestNeighborMeters: observed,
    poissonExpectedNearestNeighborMeters: expected,
    nearestNeighborIndex: observed / expected,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSettlementPlanarPositionsMeters: [
    [0, 0],
    [3, 0],
  ],
  callerStudyWindowAreaM2: 36,
} satisfies Input;
export const exampleOutput = {
  observedMeanNearestNeighborMeters: 3,
  poissonExpectedNearestNeighborMeters: 2.1213203435596424,
  nearestNeighborIndex: 1.4142135623730951,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/settlement-spacing-nearest-neighbor",
  title: "Settlement Spacing Nearest Neighbor Index",
  description:
    "Clark Evansnearest-neighbor point pattern index on explicit local planar study area, no edge correction/inferred spatial significance or contemporaneity. Caller independently establishes sample/context/calibration applicability; not definitive chronology, provenance, taxonomy, disease or human identity.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedMeanNearestNeighborMeters",
      label: "Observed mean nearest neighbor meters",
      kind: "number",
    },
    {
      id: "poissonExpectedNearestNeighborMeters",
      label: "Poisson expected nearest neighbor meters",
      kind: "number",
    },
    {
      id: "nearestNeighborIndex",
      label: "Nearest neighbor index",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSettlementPlanarPositionsMeters:
        value.observedSettlementPlanarPositionsMeters as readonly (readonly number[])[],
      callerStudyWindowAreaM2: value.callerStudyWindowAreaM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
