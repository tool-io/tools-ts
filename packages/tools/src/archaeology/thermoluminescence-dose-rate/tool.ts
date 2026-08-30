import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly componentDryDoseRatesGyPerKyr: readonly number[];
  readonly waterAttenuationFactors: readonly number[];
  readonly componentSigmaGyPerKyr: readonly number[];
  readonly cosmicDoseRateGyPerKyr: number;
  readonly cosmicSigmaGyPerKyr: number;
}>;
export type Output = Readonly<{
  readonly totalEffectiveDoseRateGyPerKyr: number;
  readonly independentDoseRateSigmaGyPerKyr: number;
}>;
const inputFields = [
  {
    id: "componentDryDoseRatesGyPerKyr",
    label: "Component dry dose rates gy per kyr",
    kind: "numberList",
  },
  {
    id: "waterAttenuationFactors",
    label: "Water attenuation factors",
    kind: "numberList",
  },
  {
    id: "componentSigmaGyPerKyr",
    label: "Component sigma gy per kyr",
    kind: "numberList",
  },
  {
    id: "cosmicDoseRateGyPerKyr",
    label: "Cosmic dose rate gy per kyr",
    kind: "number",
  },
  {
    id: "cosmicSigmaGyPerKyr",
    label: "Cosmic sigma gy per kyr",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.componentDryDoseRatesGyPerKyr.forEach((v) =>
    nonnegative(v, "componentDryDoseRatesGyPerKyr"),
  );
  input.componentSigmaGyPerKyr.forEach((v) =>
    nonnegative(v, "componentSigmaGyPerKyr"),
  );
  nonnegative(input.cosmicDoseRateGyPerKyr, "cosmicDoseRateGyPerKyr");
  nonnegative(input.cosmicSigmaGyPerKyr, "cosmicSigmaGyPerKyr");
  input.waterAttenuationFactors.forEach((v) =>
    fraction(v, "waterAttenuationFactors"),
  );
  aligned(
    input.componentDryDoseRatesGyPerKyr,
    input.waterAttenuationFactors,
    "componentDryDoseRatesGyPerKyr",
  );
  aligned(
    input.componentDryDoseRatesGyPerKyr,
    input.componentSigmaGyPerKyr,
    "componentDryDoseRatesGyPerKyr",
  );
  return {
    totalEffectiveDoseRateGyPerKyr: input.componentDryDoseRatesGyPerKyr.reduce(
      (s, v, i) => s + v * input.waterAttenuationFactors[i],
      input.cosmicDoseRateGyPerKyr,
    ),
    independentDoseRateSigmaGyPerKyr: Math.hypot(
      input.cosmicSigmaGyPerKyr,
      ...input.componentSigmaGyPerKyr.map(
        (v, i) => v * input.waterAttenuationFactors[i],
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  componentDryDoseRatesGyPerKyr: [1, 2],
  waterAttenuationFactors: [0.5, 0.8],
  componentSigmaGyPerKyr: [0.1, 0.2],
  cosmicDoseRateGyPerKyr: 0.2,
  cosmicSigmaGyPerKyr: 0.1,
} satisfies Input;
export const exampleOutput = {
  totalEffectiveDoseRateGyPerKyr: 2.3,
  independentDoseRateSigmaGyPerKyr: 0.19519221295943134,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/thermoluminescence-dose-rate",
  title: "Thermoluminescence Dose Rate",
  description:
    "Combine supplied attenuated radiation dose components plus cosmic dose and independent component uncertainty; attenuation uncertainties/covariance and dose-rate histories remain caller concerns.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalEffectiveDoseRateGyPerKyr",
      label: "Total effective dose rate gy per kyr",
      kind: "number",
    },
    {
      id: "independentDoseRateSigmaGyPerKyr",
      label: "Independent dose rate sigma gy per kyr",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      componentDryDoseRatesGyPerKyr:
        value.componentDryDoseRatesGyPerKyr as readonly number[],
      waterAttenuationFactors:
        value.waterAttenuationFactors as readonly number[],
      componentSigmaGyPerKyr: value.componentSigmaGyPerKyr as readonly number[],
      cosmicDoseRateGyPerKyr: value.cosmicDoseRateGyPerKyr as number,
      cosmicSigmaGyPerKyr: value.cosmicSigmaGyPerKyr as number,
    }),
});
export const run = tool.execute;
export default tool;
