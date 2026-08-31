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
  strictlyIncreasing,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerCaliperBandLowerEdgesCm: readonly number[];
  readonly callerRootBallMinimumDiametersCm: readonly number[];
  readonly observedStemCalipersCm: readonly number[];
  readonly observedRootBallDiametersCm: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerRequiredBallDiametersCm: readonly number[];
  readonly treesBelowCallerCaliperBallSchedule: readonly number[];
}>;
const inputFields = [
  {
    id: "callerCaliperBandLowerEdgesCm",
    label: "Caller caliper band lower edges cm",
    kind: "numberList",
  },
  {
    id: "callerRootBallMinimumDiametersCm",
    label: "Caller root ball minimum diameters cm",
    kind: "numberList",
  },
  {
    id: "observedStemCalipersCm",
    label: "Observed stem calipers cm",
    kind: "numberList",
  },
  {
    id: "observedRootBallDiametersCm",
    label: "Observed root ball diameters cm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerRootBallMinimumDiametersCm.forEach((v) =>
    positive(v, "callerRootBallMinimumDiametersCm"),
  );
  input.observedRootBallDiametersCm.forEach((v) =>
    positive(v, "observedRootBallDiametersCm"),
  );
  input.callerCaliperBandLowerEdgesCm.forEach((v) =>
    nonnegative(v, "callerCaliperBandLowerEdgesCm"),
  );
  input.observedStemCalipersCm.forEach((v) =>
    nonnegative(v, "observedStemCalipersCm"),
  );
  aligned(
    input.callerCaliperBandLowerEdgesCm,
    input.callerRootBallMinimumDiametersCm,
    "callerCaliperBandLowerEdgesCm",
  );
  aligned(
    input.observedStemCalipersCm,
    input.observedRootBallDiametersCm,
    "observedStemCalipersCm",
  );
  strictlyIncreasing(input.callerCaliperBandLowerEdgesCm, "caliper", 1);
  if (input.callerCaliperBandLowerEdgesCm[0] !== 0)
    simpleError("schedule", "Caller caliper schedule starts at zero.");
  const required = input.observedStemCalipersCm.map(
    (v) =>
      input.callerRootBallMinimumDiametersCm[
        input.callerCaliperBandLowerEdgesCm.reduce(
          (best, edge, i) => (v >= edge ? i : best),
          -1,
        )
      ],
  );
  return {
    callerRequiredBallDiametersCm: required,
    treesBelowCallerCaliperBallSchedule: required.flatMap((v, i) =>
      input.observedRootBallDiametersCm[i] < v ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCaliperBandLowerEdgesCm: [0, 2, 4],
  callerRootBallMinimumDiametersCm: [20, 40, 60],
  observedStemCalipersCm: [1, 3, 4],
  observedRootBallDiametersCm: [20, 39, 65],
} satisfies Input;
export const exampleOutput = {
  callerRequiredBallDiametersCm: [20, 40, 60],
  treesBelowCallerCaliperBallSchedule: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/caliper-to-ball-size-lookup",
  title: "Caliper To Ball Size Lookup",
  description:
    "Map actual measured calipers into explicit caller lower-inclusive root-ball sizing schedule then audit measured balls; distinct from named-tree catalog diameter/depth check, not universal standard or tree survival.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerRequiredBallDiametersCm",
      label: "Caller required ball diameters cm",
      kind: "numberList",
    },
    {
      id: "treesBelowCallerCaliperBallSchedule",
      label: "Trees below caller caliper ball schedule",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerCaliperBandLowerEdgesCm:
        value.callerCaliperBandLowerEdgesCm as readonly number[],
      callerRootBallMinimumDiametersCm:
        value.callerRootBallMinimumDiametersCm as readonly number[],
      observedStemCalipersCm: value.observedStemCalipersCm as readonly number[],
      observedRootBallDiametersCm:
        value.observedRootBallDiametersCm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
