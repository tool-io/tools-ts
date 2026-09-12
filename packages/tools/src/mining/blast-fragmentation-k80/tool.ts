import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  fraction,
  aligned,
  referenceInterpolation,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlySampledFragmentSizeKnots: readonly number[];
  readonly actualObservedCumulativeMassPassingFractions: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlySampledFragmentSizeKnots",
    label: "Actual independently sampled fragment size knots",
    kind: "numberList",
  },
  {
    id: "actualObservedCumulativeMassPassingFractions",
    label: "Actual observed cumulative mass passing fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualIndependentlySampledFragmentSizeKnots,
    input.actualObservedCumulativeMassPassingFractions,
    "fragments",
  );
  input.actualIndependentlySampledFragmentSizeKnots.forEach((v) =>
    positive(v, "size"),
  );
  input.actualObservedCumulativeMassPassingFractions.forEach((v, i) => {
    fraction(v, "passing");
    if (i && v <= input.actualObservedCumulativeMassPassingFractions[i - 1])
      simpleError(
        "passing",
        "Strictlyincreasingactualpassing,noambiguousplateau.",
      );
  });
  return {
    observedFragmentationSize: referenceInterpolation(
      input.actualObservedCumulativeMassPassingFractions,
      input.actualIndependentlySampledFragmentSizeKnots,
      0.8,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlySampledFragmentSizeKnots: [1, 2, 3],
    actualObservedCumulativeMassPassingFractions: [0.2, 0.5, 0.8],
  },
  output: { result: { observedFragmentationSize: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/blast-fragmentation-k80",
  title: "Blast Fragmentation K80 Calculator",
  description:
    "Retrospective actual sampled fragment cumulative passing inverse 80percent endpoint interpolation, no extrapolation. Not Kuz\u2013Ram charge-design prediction or explosive/site instructions.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
