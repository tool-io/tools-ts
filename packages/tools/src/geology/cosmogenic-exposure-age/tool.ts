import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualExposureGeneratedNuclideConcentration: number;
  readonly callerIndependentlyMatchedProductionPerYear: number;
  readonly callerVerifiedDecayConstantPerYear: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualExposureGeneratedNuclideConcentration",
    label: "Actual exposure generated nuclide concentration",
    kind: "number",
  },
  {
    id: "callerIndependentlyMatchedProductionPerYear",
    label: "Caller independently matched production per year",
    kind: "number",
  },
  {
    id: "callerVerifiedDecayConstantPerYear",
    label: "Caller verified decay constant per year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualExposureGeneratedNuclideConcentration, "generatedN");
  positive(input.callerIndependentlyMatchedProductionPerYear, "P");
  positive(input.callerVerifiedDecayConstantPerYear, "lambda");
  if (
    input.actualExposureGeneratedNuclideConcentration *
      input.callerVerifiedDecayConstantPerYear >=
    input.callerIndependentlyMatchedProductionPerYear
  )
    simpleError(
      "saturation",
      "Actual generated concentration strictly below no-erosion saturation.",
    );
  return {
    conditionalNoErosionExposureAgeYears:
      -Math.log1p(
        (-input.actualExposureGeneratedNuclideConcentration *
          input.callerVerifiedDecayConstantPerYear) /
          input.callerIndependentlyMatchedProductionPerYear,
      ) / input.callerVerifiedDecayConstantPerYear,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualExposureGeneratedNuclideConcentration: 1,
    callerIndependentlyMatchedProductionPerYear: 1,
    callerVerifiedDecayConstantPerYear: 0.5,
  },
  output: {
    result: { conditionalNoErosionExposureAgeYears: 1.3862943611198906 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/cosmogenic-exposure-age",
  title: "Geology Cosmogenic Exposure Age Calculator",
  description:
    "Conditional actual independently resolved cosmogenic nuclide exposure age from zero initial production pool, no erosion/burial and constant independently matched production N=P/\u03bb(1\u2212exp(\u2212\u03bbt)). Inheritance, shielding, depth/scaling, production branch and actual nuclide units independently resolved. Not simple burial radioactive age or an unconstrained geological history.",
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
