import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedAsMinedCrossSectionsM2: readonly number[];
  readonly callerIndependentOreCrossSectionsM2: readonly number[];
  readonly observedMatchedExtractionLengthsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedExcessExtractionDilutionM3: number;
}>;
const inputFields = [
  {
    id: "observedAsMinedCrossSectionsM2",
    label: "Observed as mined cross sections m2",
    kind: "numberList",
  },
  {
    id: "callerIndependentOreCrossSectionsM2",
    label: "Caller independent ore cross sections m2",
    kind: "numberList",
  },
  {
    id: "observedMatchedExtractionLengthsM",
    label: "Observed matched extraction lengths m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedExtractionLengthsM.forEach((v) =>
    positive(v, "observedMatchedExtractionLengthsM"),
  );
  input.observedAsMinedCrossSectionsM2.forEach((v) =>
    nonnegative(v, "observedAsMinedCrossSectionsM2"),
  );
  input.callerIndependentOreCrossSectionsM2.forEach((v) =>
    nonnegative(v, "callerIndependentOreCrossSectionsM2"),
  );
  aligned(
    input.observedAsMinedCrossSectionsM2,
    input.callerIndependentOreCrossSectionsM2,
    "observedAsMinedCrossSectionsM2",
  );
  aligned(
    input.observedAsMinedCrossSectionsM2,
    input.observedMatchedExtractionLengthsM,
    "observedAsMinedCrossSectionsM2",
  );
  return {
    observedExcessExtractionDilutionM3: sum(
      input.observedAsMinedCrossSectionsM2.map((v, i) => {
        const excess = v - input.callerIndependentOreCrossSectionsM2[i];
        nonnegative(excess, "excess");
        return excess * input.observedMatchedExtractionLengthsM[i];
      }),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAsMinedCrossSectionsM2: [3, 5],
  callerIndependentOreCrossSectionsM2: [2, 3],
  observedMatchedExtractionLengthsM: [2, 4],
} satisfies Input;
export const exampleOutput = {
  observedExcessExtractionDilutionM3: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/dilution-volume",
  title: "Dilution Volume Calculator",
  description:
    "Audit actual surveyed excess extraction cross-sections against independently assigned ore envelope, not assay dilution or inverse planar skin mass fraction. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedExcessExtractionDilutionM3",
      label: "Observed excess extraction dilution m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAsMinedCrossSectionsM2:
        value.observedAsMinedCrossSectionsM2 as readonly number[],
      callerIndependentOreCrossSectionsM2:
        value.callerIndependentOreCrossSectionsM2 as readonly number[],
      observedMatchedExtractionLengthsM:
        value.observedMatchedExtractionLengthsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
