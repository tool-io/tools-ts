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
  readonly harvestMassKg: number;
  readonly initialProductTemperatureC: number;
  readonly targetProductTemperatureC: number;
  readonly productSpecificHeatKjPerKgK: number;
  readonly additionalHeatLoadKj: number;
  readonly iceLatentHeatKjPerKg: number;
  readonly usefulIceCoolingFraction: number;
}>;
export type Output = Readonly<{
  readonly totalCoolingLoadKj: number;
  readonly requiredIceKg: number;
  readonly iceProductMassRatio: number;
}>;
const inputFields = [
  { id: "harvestMassKg", label: "Harvest mass kg", kind: "number" },
  {
    id: "initialProductTemperatureC",
    label: "Initial product temperature c",
    kind: "number",
  },
  {
    id: "targetProductTemperatureC",
    label: "Target product temperature c",
    kind: "number",
  },
  {
    id: "productSpecificHeatKjPerKgK",
    label: "Product specific heat kj per kg k",
    kind: "number",
  },
  {
    id: "additionalHeatLoadKj",
    label: "Additional heat load kj",
    kind: "number",
  },
  {
    id: "iceLatentHeatKjPerKg",
    label: "Ice latent heat kj per kg",
    kind: "number",
  },
  {
    id: "usefulIceCoolingFraction",
    label: "Useful ice cooling fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.harvestMassKg, "harvestMassKg");
  positive(input.productSpecificHeatKjPerKgK, "productSpecificHeatKjPerKgK");
  positive(input.iceLatentHeatKjPerKg, "iceLatentHeatKjPerKg");
  positive(input.usefulIceCoolingFraction, "usefulIceCoolingFraction");
  nonnegative(input.additionalHeatLoadKj, "additionalHeatLoadKj");
  fraction(input.usefulIceCoolingFraction, "usefulIceCoolingFraction");
  if (
    input.targetProductTemperatureC < 0 ||
    input.initialProductTemperatureC < input.targetProductTemperatureC
  )
    simpleError(
      "targetProductTemperatureC",
      "Nonfreezing cooling to a nonnegative target required.",
    );
  const totalCoolingLoadKj =
      input.harvestMassKg *
        input.productSpecificHeatKjPerKgK *
        (input.initialProductTemperatureC - input.targetProductTemperatureC) +
      input.additionalHeatLoadKj,
    requiredIceKg =
      totalCoolingLoadKj /
      (input.iceLatentHeatKjPerKg * input.usefulIceCoolingFraction);
  return {
    totalCoolingLoadKj,
    requiredIceKg,
    iceProductMassRatio: requiredIceKg / input.harvestMassKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  harvestMassKg: 1000,
  initialProductTemperatureC: 20,
  targetProductTemperatureC: 0,
  productSpecificHeatKjPerKgK: 3.5,
  additionalHeatLoadKj: 10000,
  iceLatentHeatKjPerKg: 334,
  usefulIceCoolingFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  totalCoolingLoadKj: 80000,
  requiredIceKg: 479.0419161676647,
  iceProductMassRatio: 0.47904191616766467,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/ice-requirement",
  title: "Ice Requirement Harvest",
  description:
    "Estimate melting ice at 0°C required for nonfreezing harvest cooling plus caller environmental heat load; excludes freezing and ice warming, with no food-safety or holding-time guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalCoolingLoadKj",
      label: "Total cooling load kj",
      kind: "number",
    },
    { id: "requiredIceKg", label: "Required ice kg", kind: "number" },
    {
      id: "iceProductMassRatio",
      label: "Ice product mass ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      harvestMassKg: value.harvestMassKg as number,
      initialProductTemperatureC: value.initialProductTemperatureC as number,
      targetProductTemperatureC: value.targetProductTemperatureC as number,
      productSpecificHeatKjPerKgK: value.productSpecificHeatKjPerKgK as number,
      additionalHeatLoadKj: value.additionalHeatLoadKj as number,
      iceLatentHeatKjPerKg: value.iceLatentHeatKjPerKg as number,
      usefulIceCoolingFraction: value.usefulIceCoolingFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
