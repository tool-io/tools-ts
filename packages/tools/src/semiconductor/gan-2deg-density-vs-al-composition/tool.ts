import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  curve,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedAlCompositionFractions: readonly number[];
  readonly observedMatched2degPerM2: readonly number[];
  readonly queryAlCompositionFraction: number;
}>;
export type Output = Readonly<{
  readonly interpolatedGan2degPerM2: number;
  readonly localMeasuredResponseDerivative: number;
}>;
const inputFields = [
  {
    id: "observedAlCompositionFractions",
    label: "Observed al composition fractions",
    kind: "numberList",
  },
  {
    id: "observedMatched2degPerM2",
    label: "Observed matched2deg per m2",
    kind: "numberList",
  },
  {
    id: "queryAlCompositionFraction",
    label: "Query al composition fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatched2degPerM2.forEach((v) =>
    positive(v, "observedMatched2degPerM2"),
  );
  input.observedAlCompositionFractions.forEach((v) =>
    fraction(v, "observedAlCompositionFractions"),
  );
  fraction(input.queryAlCompositionFraction, "queryAlCompositionFraction");
  const result = curve(
    input.observedAlCompositionFractions,
    input.observedMatched2degPerM2,
    input.queryAlCompositionFraction,
  );
  return {
    interpolatedGan2degPerM2: result.value,
    localMeasuredResponseDerivative: result.slope,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAlCompositionFractions: [0.1, 0.2, 0.3],
  observedMatched2degPerM2: [2, 4, 8],
  queryAlCompositionFraction: 0.25,
} satisfies Input;
export const exampleOutput = {
  interpolatedGan2degPerM2: 6,
  localMeasuredResponseDerivative: 40,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/gan-2deg-density-vs-al-composition",
  title: "Semiconductor Gan 2deg Density Vs Al Composition Calculator",
  description:
    "Read independently measured same-stack Al-composition/2DEG calibration, not band-offset capacitor density or composition-only universal. Independently matched measured piecewise-linear curve only, local slope retained; no extrapolation, invented material constants, process recipe or safety claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedGan2degPerM2",
      label: "Interpolated gan2deg per m2",
      kind: "number",
    },
    {
      id: "localMeasuredResponseDerivative",
      label: "Local measured response derivative",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAlCompositionFractions:
        value.observedAlCompositionFractions as readonly number[],
      observedMatched2degPerM2:
        value.observedMatched2degPerM2 as readonly number[],
      queryAlCompositionFraction: value.queryAlCompositionFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
