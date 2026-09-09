import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
  positive,
  nonnegative,
  fraction,
  sum,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualFaultedIntervalThicknessesMeters: readonly number[];
  readonly independentlyAssessedIntervalShaleFractions: readonly number[];
  readonly actualFaultThrowMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualFaultedIntervalThicknessesMeters",
    label: "Actual faulted interval thicknesses meters",
    kind: "numberList",
  },
  {
    id: "independentlyAssessedIntervalShaleFractions",
    label: "Independently assessed interval shale fractions",
    kind: "numberList",
  },
  {
    id: "actualFaultThrowMeters",
    label: "Actual fault throw meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualFaultedIntervalThicknessesMeters,
    input.independentlyAssessedIntervalShaleFractions,
    "intervals",
  );
  input.actualFaultedIntervalThicknessesMeters.forEach((v) =>
    nonnegative(v, "thickness"),
  );
  input.independentlyAssessedIntervalShaleFractions.forEach((v) =>
    fraction(v, "shale"),
  );
  positive(input.actualFaultThrowMeters, "throw");
  if (
    sum(input.actualFaultedIntervalThicknessesMeters) >
    input.actualFaultThrowMeters
  )
    simpleError(
      "intervals",
      "Disjoint accounted interval thicknesswithin fault throw.",
    );
  return {
    conditionalShaleGougeRatioPercent:
      (100 *
        sum(
          input.actualFaultedIntervalThicknessesMeters.map(
            (v, i) => v * input.independentlyAssessedIntervalShaleFractions[i],
          ),
        )) /
      input.actualFaultThrowMeters,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualFaultedIntervalThicknessesMeters: [2, 3],
    independentlyAssessedIntervalShaleFractions: [0.5, 1],
    actualFaultThrowMeters: 10,
  },
  output: { result: { conditionalShaleGougeRatioPercent: 40 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/shale-gouge-ratio-sgr",
  title: "Geology Shale Gouge Ratio Sgr Calculator",
  description:
    "Declared SGRsum shale fraction\u00d7actual faulted interval thickness/faultthrow. Complete actual displaced stratigraphy required; no assume sealing, pore pressure or a hydrocarbon column.",
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
