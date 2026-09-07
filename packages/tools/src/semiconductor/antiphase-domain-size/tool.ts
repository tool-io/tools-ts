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
  readonly observedAntiphaseDomainAreasNm2: readonly number[];
  readonly observedRepresentedDomainCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly equivalentCircleDomainDiametersNm: readonly number[];
  readonly numberWeightedMeanDomainDiameterNm: number;
}>;
const inputFields = [
  {
    id: "observedAntiphaseDomainAreasNm2",
    label: "Observed antiphase domain areas nm2",
    kind: "numberList",
  },
  {
    id: "observedRepresentedDomainCounts",
    label: "Observed represented domain counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedAntiphaseDomainAreasNm2.forEach((v) =>
    positive(v, "observedAntiphaseDomainAreasNm2"),
  );
  aligned(
    input.observedAntiphaseDomainAreasNm2,
    input.observedRepresentedDomainCounts,
    "observedAntiphaseDomainAreasNm2",
  );
  input.observedRepresentedDomainCounts.forEach((v) =>
    bounded(v, "count", 0, 1000000),
  );
  const diameter = input.observedAntiphaseDomainAreasNm2.map(
      (v) => 2 * Math.sqrt(v / Math.PI),
    ),
    w = weights(input.observedRepresentedDomainCounts);
  return {
    equivalentCircleDomainDiametersNm: diameter,
    numberWeightedMeanDomainDiameterNm: sum(diameter.map((v, i) => v * w[i])),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAntiphaseDomainAreasNm2: [3.141592653589793, 12.566370614359172],
  observedRepresentedDomainCounts: [1, 1],
} satisfies Input;
export const exampleOutput = {
  equivalentCircleDomainDiametersNm: [2, 4],
  numberWeightedMeanDomainDiameterNm: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/antiphase-domain-size",
  title: "Semiconductor Antiphase Domain Size Calculator",
  description:
    "Summarize independently segmented antiphase domain areas as equal-area diameters with explicit represented-domain counts, not diffraction Scherrer length or quantum-dot sizes.",
  inputs: inputFields,
  outputs: [
    {
      id: "equivalentCircleDomainDiametersNm",
      label: "Equivalent circle domain diameters nm",
      kind: "numberList",
    },
    {
      id: "numberWeightedMeanDomainDiameterNm",
      label: "Number weighted mean domain diameter nm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAntiphaseDomainAreasNm2:
        value.observedAntiphaseDomainAreasNm2 as readonly number[],
      observedRepresentedDomainCounts:
        value.observedRepresentedDomainCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
