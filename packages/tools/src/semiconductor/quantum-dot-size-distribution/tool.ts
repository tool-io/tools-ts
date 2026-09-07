import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  bounded,
  aligned,
  sum,
  weights,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedQuantumDotDiametersNm: readonly number[];
  readonly observedRepresentedDotCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly numberWeightedMeanDiameterNm: number;
  readonly numberWeightedDiameterStdDevNm: number;
  readonly numberWeightedDiameterCv: number;
}>;
const inputFields = [
  {
    id: "observedQuantumDotDiametersNm",
    label: "Observed quantum dot diameters nm",
    kind: "numberList",
  },
  {
    id: "observedRepresentedDotCounts",
    label: "Observed represented dot counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedQuantumDotDiametersNm.forEach((v) =>
    positive(v, "observedQuantumDotDiametersNm"),
  );
  aligned(
    input.observedQuantumDotDiametersNm,
    input.observedRepresentedDotCounts,
    "observedQuantumDotDiametersNm",
  );
  input.observedRepresentedDotCounts.forEach((v) =>
    bounded(v, "count", 0, 1000000),
  );
  const w = weights(input.observedRepresentedDotCounts),
    m = sum(w.map((v, i) => v * input.observedQuantumDotDiametersNm[i])),
    variance = sum(
      w.map((v, i) => v * (input.observedQuantumDotDiametersNm[i] - m) ** 2),
    );
  return {
    numberWeightedMeanDiameterNm: m,
    numberWeightedDiameterStdDevNm: Math.sqrt(variance),
    numberWeightedDiameterCv: Math.sqrt(variance) / m,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedQuantumDotDiametersNm: [2, 4, 6],
  observedRepresentedDotCounts: [1, 2, 1],
} satisfies Input;
export const exampleOutput = {
  numberWeightedMeanDiameterNm: 4,
  numberWeightedDiameterStdDevNm: 1.4142135623730951,
  numberWeightedDiameterCv: 0.3535533905932738,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/quantum-dot-size-distribution",
  title: "Semiconductor Quantum Dot Size Distribution Calculator",
  description:
    "Summarize actual number-weighted quantum-dot size observations with population spread/CV, not inferred size from absorption or volume weighting.",
  inputs: inputFields,
  outputs: [
    {
      id: "numberWeightedMeanDiameterNm",
      label: "Number weighted mean diameter nm",
      kind: "number",
    },
    {
      id: "numberWeightedDiameterStdDevNm",
      label: "Number weighted diameter std dev nm",
      kind: "number",
    },
    {
      id: "numberWeightedDiameterCv",
      label: "Number weighted diameter cv",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedQuantumDotDiametersNm:
        value.observedQuantumDotDiametersNm as readonly number[],
      observedRepresentedDotCounts:
        value.observedRepresentedDotCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
