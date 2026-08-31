import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
  unique,
  strictlyIncreasing,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerSizeClassIds: readonly string[];
  readonly callerSizeClassLowerEdgesCm: readonly number[];
  readonly observedPlantSizesCm: readonly number[];
  readonly sizeObservationFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerObservedSizeClassIndices: readonly number[];
  readonly knownClassCounts: readonly number[];
  readonly unknownSizeCount: number;
}>;
const inputFields = [
  {
    id: "callerSizeClassIds",
    label: "Caller size class ids",
    kind: "stringList",
  },
  {
    id: "callerSizeClassLowerEdgesCm",
    label: "Caller size class lower edges cm",
    kind: "numberList",
  },
  {
    id: "observedPlantSizesCm",
    label: "Observed plant sizes cm",
    kind: "numberList",
  },
  {
    id: "sizeObservationFlags",
    label: "Size observation flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerSizeClassLowerEdgesCm.forEach((v) =>
    nonnegative(v, "callerSizeClassLowerEdgesCm"),
  );
  input.observedPlantSizesCm.forEach((v) =>
    nonnegative(v, "observedPlantSizesCm"),
  );
  binary(input.sizeObservationFlags, "sizeObservationFlags");
  aligned(
    input.callerSizeClassIds,
    input.callerSizeClassLowerEdgesCm,
    "callerSizeClassIds",
  );
  aligned(
    input.observedPlantSizesCm,
    input.sizeObservationFlags,
    "observedPlantSizesCm",
  );
  unique(input.callerSizeClassIds, "classes");
  strictlyIncreasing(input.callerSizeClassLowerEdgesCm, "edges", 1);
  if (input.callerSizeClassLowerEdgesCm[0] !== 0)
    simpleError("classes", "Caller size classes must begin at zero.");
  const indices = input.observedPlantSizesCm.map((v, i) =>
    input.sizeObservationFlags[i]
      ? input.callerSizeClassLowerEdgesCm.reduce(
          (best, edge, j) => (v >= edge ? j : best),
          -1,
        )
      : -1,
  );
  return {
    callerObservedSizeClassIndices: indices,
    knownClassCounts: input.callerSizeClassIds.map(
      (_, i) => indices.filter((v) => v === i).length,
    ),
    unknownSizeCount: indices.filter((v) => v === -1).length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSizeClassIds: ["small", "medium", "large"],
  callerSizeClassLowerEdgesCm: [0, 10, 20],
  observedPlantSizesCm: [5, 10, 25],
  sizeObservationFlags: [1, 0, 1],
} satisfies Input;
export const exampleOutput = {
  callerObservedSizeClassIndices: [0, -1, 2],
  knownClassCounts: [1, 0, 1],
  unknownSizeCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/grading-size-class-lookup",
  title: "Grading Size Class Lookup",
  description:
    "Audit actual plant-size annotations against explicit caller lower-inclusive grading bands, retaining unobserved size separately; no official plant grade or suitability inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerObservedSizeClassIndices",
      label: "Caller observed size class indices",
      kind: "numberList",
    },
    { id: "knownClassCounts", label: "Known class counts", kind: "numberList" },
    { id: "unknownSizeCount", label: "Unknown size count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      callerSizeClassIds: value.callerSizeClassIds as readonly string[],
      callerSizeClassLowerEdgesCm:
        value.callerSizeClassLowerEdgesCm as readonly number[],
      observedPlantSizesCm: value.observedPlantSizesCm as readonly number[],
      sizeObservationFlags: value.sizeObservationFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
