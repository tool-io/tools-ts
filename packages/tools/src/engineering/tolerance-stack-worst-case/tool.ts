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
  sum,
  ordered,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly nominalDimensions: readonly number[];
  readonly signedSensitivityCoefficients: readonly number[];
  readonly lowerDimensionDeviations: readonly number[];
  readonly upperDimensionDeviations: readonly number[];
}>;
export type Output = Readonly<{
  readonly nominalStack: number;
  readonly worstCaseStackLower: number;
  readonly worstCaseStackUpper: number;
}>;
const inputFields = [
  { id: "nominalDimensions", label: "Nominal dimensions", kind: "numberList" },
  {
    id: "signedSensitivityCoefficients",
    label: "Signed sensitivity coefficients",
    kind: "numberList",
  },
  {
    id: "lowerDimensionDeviations",
    label: "Lower dimension deviations",
    kind: "numberList",
  },
  {
    id: "upperDimensionDeviations",
    label: "Upper dimension deviations",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.nominalDimensions,
    input.signedSensitivityCoefficients,
    "nominalDimensions",
  );
  aligned(
    input.nominalDimensions,
    input.lowerDimensionDeviations,
    "nominalDimensions",
  );
  aligned(
    input.nominalDimensions,
    input.upperDimensionDeviations,
    "nominalDimensions",
  );
  input.lowerDimensionDeviations.forEach((v, i) => {
    ordered(v, input.upperDimensionDeviations[i]);
    if (v > 0 || input.upperDimensionDeviations[i] < 0)
      simpleError("deviations", "Lower≤0≤upper deviation.");
  });
  const nominal = sum(
    input.nominalDimensions.map(
      (v, i) => v * input.signedSensitivityCoefficients[i],
    ),
  );
  return {
    nominalStack: nominal,
    worstCaseStackLower:
      nominal +
      sum(
        input.signedSensitivityCoefficients.map(
          (v, i) =>
            v *
            (v >= 0
              ? input.lowerDimensionDeviations[i]
              : input.upperDimensionDeviations[i]),
        ),
      ),
    worstCaseStackUpper:
      nominal +
      sum(
        input.signedSensitivityCoefficients.map(
          (v, i) =>
            v *
            (v >= 0
              ? input.upperDimensionDeviations[i]
              : input.lowerDimensionDeviations[i]),
        ),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  nominalDimensions: [10, 20],
  signedSensitivityCoefficients: [1, -1],
  lowerDimensionDeviations: [-1, -2],
  upperDimensionDeviations: [2, 3],
} satisfies Input;
export const exampleOutput = {
  nominalStack: -10,
  worstCaseStackLower: -14,
  worstCaseStackUpper: -6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/tolerance-stack-worst-case",
  title: "Worst-Case Tolerance Stack Calculator",
  description:
    "Signed asymmetric independent interval tolerance envelope, not an unweighted symmetric tolerance sum. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    { id: "nominalStack", label: "Nominal stack", kind: "number" },
    {
      id: "worstCaseStackLower",
      label: "Worst case stack lower",
      kind: "number",
    },
    {
      id: "worstCaseStackUpper",
      label: "Worst case stack upper",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      nominalDimensions: value.nominalDimensions as readonly number[],
      signedSensitivityCoefficients:
        value.signedSensitivityCoefficients as readonly number[],
      lowerDimensionDeviations:
        value.lowerDimensionDeviations as readonly number[],
      upperDimensionDeviations:
        value.upperDimensionDeviations as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
