import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";

export type Input = Readonly<{
  readonly absorbedMeanRadiationWPerM2: number;
  readonly effectiveThermalEmissivity: number;
  readonly stefanBoltzmannWPerM2K4: number;
  readonly linearCoolingWPerM2K: number;
  readonly minimumTemperatureK: number;
  readonly maximumTemperatureK: number;
}>;
export type Output = Readonly<{
  readonly equilibriumModelTemperatureK: number;
  readonly energyBalanceResidualWPerM2: number;
}>;
const inputFields = [
  {
    id: "absorbedMeanRadiationWPerM2",
    label: "Absorbed mean radiation w per m2",
    kind: "number",
  },
  {
    id: "effectiveThermalEmissivity",
    label: "Effective thermal emissivity",
    kind: "number",
  },
  {
    id: "stefanBoltzmannWPerM2K4",
    label: "Stefan boltzmann w per m2 k4",
    kind: "number",
  },
  {
    id: "linearCoolingWPerM2K",
    label: "Linear cooling w per m2 k",
    kind: "number",
  },
  { id: "minimumTemperatureK", label: "Minimum temperature k", kind: "number" },
  { id: "maximumTemperatureK", label: "Maximum temperature k", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.effectiveThermalEmissivity, "effectiveThermalEmissivity");
  positive(input.stefanBoltzmannWPerM2K4, "stefanBoltzmannWPerM2K4");
  positive(input.minimumTemperatureK, "minimumTemperatureK");
  positive(input.maximumTemperatureK, "maximumTemperatureK");
  nonnegative(input.absorbedMeanRadiationWPerM2, "absorbedMeanRadiationWPerM2");
  nonnegative(input.linearCoolingWPerM2K, "linearCoolingWPerM2K");
  fraction(input.effectiveThermalEmissivity, "effectiveThermalEmissivity");
  if (input.maximumTemperatureK <= input.minimumTemperatureK)
    simpleError(
      "bracket",
      "Increasing equilibrium-temperature bracket required.",
    );
  const balance = (t: number) =>
    input.effectiveThermalEmissivity * input.stefanBoltzmannWPerM2K4 * t ** 4 +
    input.linearCoolingWPerM2K * t -
    input.absorbedMeanRadiationWPerM2;
  let lo = input.minimumTemperatureK,
    hi = input.maximumTemperatureK;
  if (
    !Number.isFinite(balance(lo)) ||
    !Number.isFinite(balance(hi)) ||
    balance(lo) > 0 ||
    balance(hi) < 0
  )
    simpleError(
      "bracket",
      "Finite bracket enclosing unique monotone energy-balance root required.",
    );
  for (let i = 0; i < 80; i++) {
    const mid = lo + (hi - lo) / 2;
    if (balance(mid) < 0) lo = mid;
    else hi = mid;
  }
  const equilibriumModelTemperatureK = lo + (hi - lo) / 2;
  return {
    equilibriumModelTemperatureK,
    energyBalanceResidualWPerM2: balance(equilibriumModelTemperatureK),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  absorbedMeanRadiationWPerM2: 16,
  effectiveThermalEmissivity: 1,
  stefanBoltzmannWPerM2K4: 1,
  linearCoolingWPerM2K: 0,
  minimumTemperatureK: 1,
  maximumTemperatureK: 3,
} satisfies Input;
export const exampleOutput = {
  equilibriumModelTemperatureK: 2,
  energyBalanceResidualWPerM2: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/ebm-equilibrium-temp",
  title: "Simple Energy Balance Model Equilibrium Temp Solver",
  description:
    "Solve bounded monotone nonlinear emissive-plus-linear-cooling energy balance with residual; extra cooling differs from blackbody solar equilibrium, assumptions are caller supplied and not a validated climate forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "equilibriumModelTemperatureK",
      label: "Equilibrium model temperature k",
      kind: "number",
    },
    {
      id: "energyBalanceResidualWPerM2",
      label: "Energy balance residual w per m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      absorbedMeanRadiationWPerM2: value.absorbedMeanRadiationWPerM2 as number,
      effectiveThermalEmissivity: value.effectiveThermalEmissivity as number,
      stefanBoltzmannWPerM2K4: value.stefanBoltzmannWPerM2K4 as number,
      linearCoolingWPerM2K: value.linearCoolingWPerM2K as number,
      minimumTemperatureK: value.minimumTemperatureK as number,
      maximumTemperatureK: value.maximumTemperatureK as number,
    }),
});
export const run = tool.execute;
export default tool;
