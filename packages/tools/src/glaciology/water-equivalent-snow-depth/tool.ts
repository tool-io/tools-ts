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
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly snowCoreAreaM2: number;
  readonly wetSampleMassKg: number;
  readonly tareMassKg: number;
  readonly waterDensityKgM3: number;
}>;
export type Output = Readonly<{
  readonly netSnowCoreMassKg: number;
  readonly coreSnowWaterEquivalentM: number;
}>;
const inputFields = [
  { id: "snowCoreAreaM2", label: "Snow core area m2", kind: "number" },
  { id: "wetSampleMassKg", label: "Wet sample mass kg", kind: "number" },
  { id: "tareMassKg", label: "Tare mass kg", kind: "number" },
  { id: "waterDensityKgM3", label: "Water density kg m3", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.snowCoreAreaM2, "snowCoreAreaM2");
  positive(input.waterDensityKgM3, "waterDensityKgM3");
  nonnegative(input.wetSampleMassKg, "wetSampleMassKg");
  nonnegative(input.tareMassKg, "tareMassKg");
  if (input.tareMassKg > input.wetSampleMassKg)
    simpleError(
      "sample",
      "Gross core mass must be at least tare; negative core mass is invalid.",
    );
  const net = input.wetSampleMassKg - input.tareMassKg;
  return {
    netSnowCoreMassKg: net,
    coreSnowWaterEquivalentM:
      net / input.waterDensityKgM3 / input.snowCoreAreaM2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  snowCoreAreaM2: 0.01,
  wetSampleMassKg: 3,
  tareMassKg: 1,
  waterDensityKgM3: 1000,
} satisfies Input;
export const exampleOutput = {
  netSnowCoreMassKg: 2,
  coreSnowWaterEquivalentM: 0.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/water-equivalent-snow-depth",
  title: "Water Equivalent Snow Depth Calculator",
  description:
    "Compute SWE from actual gravimetric snow core area and gross/tare masses, not a duplicate depth-density conversion or unverified universal density.",
  inputs: inputFields,
  outputs: [
    { id: "netSnowCoreMassKg", label: "Net snow core mass kg", kind: "number" },
    {
      id: "coreSnowWaterEquivalentM",
      label: "Core snow water equivalent m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      snowCoreAreaM2: value.snowCoreAreaM2 as number,
      wetSampleMassKg: value.wetSampleMassKg as number,
      tareMassKg: value.tareMassKg as number,
      waterDensityKgM3: value.waterDensityKgM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
