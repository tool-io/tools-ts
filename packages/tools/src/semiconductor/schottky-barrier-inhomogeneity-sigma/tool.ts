import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, mean } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyAssessedBarrierHeightsEv: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyAssessedBarrierHeightsEv",
    label: "Actual independently assessed barrier heights ev",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  input.actualIndependentlyAssessedBarrierHeightsEv.forEach((v) =>
    nonnegative(v, "barrier"),
  );
  const m = mean(input.actualIndependentlyAssessedBarrierHeightsEv);
  return {
    observedBarrierMeanEv: m,
    observedPopulationBarrierSigmaEv: Math.sqrt(
      mean(
        input.actualIndependentlyAssessedBarrierHeightsEv.map(
          (v) => (v - m) ** 2,
        ),
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualIndependentlyAssessedBarrierHeightsEv: [0.5, 0.7, 0.9] },
  output: {
    result: {
      observedBarrierMeanEv: 0.7,
      observedPopulationBarrierSigmaEv: 0.16329931618554522,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/schottky-barrier-inhomogeneity-sigma",
  title: "Semiconductor Schottky Barrier Inhomogeneity Sigma Calculator",
  description:
    "Actual Schottky-barrier spatial distribution population SD, not infer inhomogeneity from oneI-Vcurve or subtract measurement uncertainty. Independent same-condition barrier assessments and area sampling external.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
