import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  finite,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly signedSensitivityCoefficients: readonly number[];
  readonly dimensionStandardDeviations: readonly number[];
  readonly callerIndependenceVerified: boolean;
}>;
export type Output = Readonly<{ readonly rssStackStandardDeviation: number }>;
const inputFields = [
  {
    id: "signedSensitivityCoefficients",
    label: "Signed sensitivity coefficients",
    kind: "numberList",
  },
  {
    id: "dimensionStandardDeviations",
    label: "Dimension standard deviations",
    kind: "numberList",
  },
  {
    id: "callerIndependenceVerified",
    label: "Caller independence verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.dimensionStandardDeviations.forEach((v) =>
    nonnegative(v, "dimensionStandardDeviations"),
  );
  aligned(
    input.signedSensitivityCoefficients,
    input.dimensionStandardDeviations,
    "signedSensitivityCoefficients",
  );
  if (!input.callerIndependenceVerified)
    simpleError(
      "independence",
      "Caller independently establishes zero covariance, not correlated bounded tolerances.",
    );
  return {
    rssStackStandardDeviation: Math.hypot(
      ...input.signedSensitivityCoefficients.map((v, i) =>
        finite(v * input.dimensionStandardDeviations[i]),
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  signedSensitivityCoefficients: [1, -1],
  dimensionStandardDeviations: [3, 4],
  callerIndependenceVerified: true,
} satisfies Input;
export const exampleOutput = { rssStackStandardDeviation: 5 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/tolerance-stack-rss",
  title: "RSS Tolerance Stack Calculator",
  description:
    "Sensitivity-weighted independent standard-deviation RSS, not worst-case tolerances or assumed confidence interval. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "rssStackStandardDeviation",
      label: "Rss stack standard deviation",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      signedSensitivityCoefficients:
        value.signedSensitivityCoefficients as readonly number[],
      dimensionStandardDeviations:
        value.dimensionStandardDeviations as readonly number[],
      callerIndependenceVerified: value.callerIndependenceVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
