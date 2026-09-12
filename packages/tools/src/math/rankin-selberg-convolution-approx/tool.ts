import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  sum,
  aligned,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualQualifiedFirstCoefficients: readonly number[];
  readonly actualQualifiedSecondRealCoefficients: readonly number[];
  readonly actualRealExponent: number;
  readonly callerIndependentZetaFactor: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualQualifiedFirstCoefficients",
    label: "Actual qualified first coefficients",
    kind: "numberList",
  },
  {
    id: "actualQualifiedSecondRealCoefficients",
    label: "Actual qualified second real coefficients",
    kind: "numberList",
  },
  { id: "actualRealExponent", label: "Actual real exponent", kind: "number" },
  {
    id: "callerIndependentZetaFactor",
    label: "Caller independent zeta factor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualQualifiedFirstCoefficients,
    input.actualQualifiedSecondRealCoefficients,
    "coefficients",
  );
  positive(input.actualRealExponent, "s");
  positive(input.callerIndependentZetaFactor, "zeta2snormalization");
  return {
    truncatedConvolution:
      input.callerIndependentZetaFactor *
      sum(
        input.actualQualifiedFirstCoefficients.map(
          (v, i) =>
            (v * input.actualQualifiedSecondRealCoefficients[i]) /
            (i + 1) ** input.actualRealExponent,
        ),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualQualifiedFirstCoefficients: [1, 2],
    actualQualifiedSecondRealCoefficients: [1, 3],
    actualRealExponent: 2,
    callerIndependentZetaFactor: 1,
  },
  output: { result: { truncatedConvolution: 2.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/rankin-selberg-convolution-approx",
  title: "Rankin-Selberg Convolution Approximation",
  description:
    "DeclaredrealRankin\u2013Selberg finite coefficient convolution\u03b6(2s)\u03a3a_nconj(b_n) n^\u2212s, normalized level ONEH eckeeigenformsunderindependentcoefficient/weight shift convention; externally verified\u03b6factor, not fullLvalue/tail certification. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
