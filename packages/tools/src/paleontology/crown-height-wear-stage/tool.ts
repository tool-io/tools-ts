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
  fraction,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly observedCrownHeightsMm: readonly number[];
  readonly referenceUnwornCrownHeightsMm: readonly number[];
  readonly callerWearLossLowerEdges: readonly number[];
}>;
export type Output = Readonly<{
  readonly crownHeightLossFractions: readonly number[];
  readonly callerWearStageCodes: readonly number[];
}>;
const inputFields = [
  {
    id: "observedCrownHeightsMm",
    label: "Observed crown heights mm",
    kind: "numberList",
  },
  {
    id: "referenceUnwornCrownHeightsMm",
    label: "Reference unworn crown heights mm",
    kind: "numberList",
  },
  {
    id: "callerWearLossLowerEdges",
    label: "Caller wear loss lower edges",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.referenceUnwornCrownHeightsMm.forEach((v) =>
    positive(v, "referenceUnwornCrownHeightsMm"),
  );
  input.observedCrownHeightsMm.forEach((v) =>
    nonnegative(v, "observedCrownHeightsMm"),
  );
  input.callerWearLossLowerEdges.forEach((v) =>
    fraction(v, "callerWearLossLowerEdges"),
  );
  aligned(
    input.observedCrownHeightsMm,
    input.referenceUnwornCrownHeightsMm,
    "observedCrownHeightsMm",
  );
  ordered(input.callerWearLossLowerEdges, "callerWearLossLowerEdges");
  if (
    input.callerWearLossLowerEdges[0] !== 0 ||
    input.callerWearLossLowerEdges.length > 128
  )
    simpleError(
      "stages",
      "Bounded caller loss edges beginning at zero required.",
    );
  const crownHeightLossFractions = input.observedCrownHeightsMm.map((v, i) =>
    fraction(
      1 - v / input.referenceUnwornCrownHeightsMm[i],
      "observedCrownHeightsMm",
    ),
  );
  return {
    crownHeightLossFractions,
    callerWearStageCodes: crownHeightLossFractions.map((v) => {
      const i = input.callerWearLossLowerEdges.findIndex((x) => x > v);
      return i < 0 ? input.callerWearLossLowerEdges.length - 1 : i - 1;
    }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCrownHeightsMm: [5, 2],
  referenceUnwornCrownHeightsMm: [10, 10],
  callerWearLossLowerEdges: [0, 0.3, 0.7],
} satisfies Input;
export const exampleOutput = {
  crownHeightLossFractions: [0.5, 0.8],
  callerWearStageCodes: [1, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/crown-height-wear-stage",
  title: "Tooth Crown Height Wear Stage Rater",
  description:
    "Screen measured relative tooth crown loss against caller wear bands on comparable unworn reference crowns; no embedded species ages, reconstructed wear history or diet diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "crownHeightLossFractions",
      label: "Crown height loss fractions",
      kind: "numberList",
    },
    {
      id: "callerWearStageCodes",
      label: "Caller wear stage codes",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCrownHeightsMm: value.observedCrownHeightsMm as readonly number[],
      referenceUnwornCrownHeightsMm:
        value.referenceUnwornCrownHeightsMm as readonly number[],
      callerWearLossLowerEdges:
        value.callerWearLossLowerEdges as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
