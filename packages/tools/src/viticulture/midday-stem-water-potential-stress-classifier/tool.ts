import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  unique,
  strictlyIncreasing,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerWaterStatusClassLabels: readonly string[];
  readonly callerWaterPotentialUpperEdgesMpa: readonly number[];
  readonly observedStemWaterPotentialsMpa: readonly number[];
  readonly measurementEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerWaterStatusClassIndices: readonly number[];
  readonly unknownStemWaterPotentialIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "callerWaterStatusClassLabels",
    label: "Caller water status class labels",
    kind: "stringList",
  },
  {
    id: "callerWaterPotentialUpperEdgesMpa",
    label: "Caller water potential upper edges mpa",
    kind: "numberList",
  },
  {
    id: "observedStemWaterPotentialsMpa",
    label: "Observed stem water potentials mpa",
    kind: "numberList",
  },
  {
    id: "measurementEvidenceFlags",
    label: "Measurement evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(input.measurementEvidenceFlags, "measurementEvidenceFlags");
  aligned(
    input.observedStemWaterPotentialsMpa,
    input.measurementEvidenceFlags,
    "observedStemWaterPotentialsMpa",
  );
  unique(input.callerWaterStatusClassLabels, "classes");
  strictlyIncreasing(input.callerWaterPotentialUpperEdgesMpa, "edges", 1);
  if (
    input.callerWaterStatusClassLabels.length !==
      input.callerWaterPotentialUpperEdgesMpa.length + 1 ||
    input.callerWaterPotentialUpperEdgesMpa.some((v) => v > 0) ||
    input.observedStemWaterPotentialsMpa.some((v) => v > 0)
  )
    simpleError(
      "potential",
      "Caller ordered nonpositive MPa edges/observations and one extra label required.",
    );
  return {
    callerWaterStatusClassIndices: input.observedStemWaterPotentialsMpa.map(
      (v, i) => {
        if (!input.measurementEvidenceFlags[i]) return -1;
        const j = input.callerWaterPotentialUpperEdgesMpa.findIndex(
          (edge) => v <= edge,
        );
        return j < 0 ? input.callerWaterPotentialUpperEdgesMpa.length : j;
      },
    ),
    unknownStemWaterPotentialIndices: input.measurementEvidenceFlags.flatMap(
      (v, i) => (v ? [] : [i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerWaterStatusClassLabels: ["lower-tension", "middle", "higher-tension"],
  callerWaterPotentialUpperEdgesMpa: [-1.2, -0.8],
  observedStemWaterPotentialsMpa: [-0.6, -1, -1.4],
  measurementEvidenceFlags: [1, 0, 1],
} satisfies Input;
export const exampleOutput = {
  callerWaterStatusClassIndices: [2, -1, 0],
  unknownStemWaterPotentialIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/midday-stem-water-potential-stress-classifier",
  title: "Midday Stem Water Potential Stress Classifier",
  description:
    "Classify actual midday stem-water-potential evidence using explicitly ordered caller nonpositive MPa bands; indices follow supplied labels not universal stress scale, no irrigation need or vine safety diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerWaterStatusClassIndices",
      label: "Caller water status class indices",
      kind: "numberList",
    },
    {
      id: "unknownStemWaterPotentialIndices",
      label: "Unknown stem water potential indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerWaterStatusClassLabels:
        value.callerWaterStatusClassLabels as readonly string[],
      callerWaterPotentialUpperEdgesMpa:
        value.callerWaterPotentialUpperEdgesMpa as readonly number[],
      observedStemWaterPotentialsMpa:
        value.observedStemWaterPotentialsMpa as readonly number[],
      measurementEvidenceFlags:
        value.measurementEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
