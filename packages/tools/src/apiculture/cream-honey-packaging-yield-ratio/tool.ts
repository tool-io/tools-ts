import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  count,
} from "../shared.js";
export type Input = Readonly<{
  readonly seedHoneyKg: number;
  readonly liquidHoneyKg: number;
  readonly mixedProcessLossFraction: number;
  readonly jarFillKg: number;
}>;
export type Output = Readonly<{
  readonly seedMassFraction: number;
  readonly packagedHoneyKg: number;
  readonly completeJarCount: number;
}>;
const inputFields = [
  { id: "seedHoneyKg", label: "Seed honey kg", kind: "number" },
  { id: "liquidHoneyKg", label: "Liquid honey kg", kind: "number" },
  {
    id: "mixedProcessLossFraction",
    label: "Mixed process loss fraction",
    kind: "number",
  },
  { id: "jarFillKg", label: "Jar fill kg", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.jarFillKg, "jarFillKg");
  nonnegative(input.seedHoneyKg, "seedHoneyKg");
  nonnegative(input.liquidHoneyKg, "liquidHoneyKg");
  fraction(input.mixedProcessLossFraction, "mixedProcessLossFraction");
  const mass = positive(input.seedHoneyKg + input.liquidHoneyKg, "honeyMass"),
    packagedHoneyKg = mass * (1 - input.mixedProcessLossFraction);
  return {
    seedMassFraction: input.seedHoneyKg / mass,
    packagedHoneyKg,
    completeJarCount: count(
      Math.floor(packagedHoneyKg / input.jarFillKg),
      "completeJarCount",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  seedHoneyKg: 2,
  liquidHoneyKg: 18,
  mixedProcessLossFraction: 0.1,
  jarFillKg: 0.5,
} satisfies Input;
export const exampleOutput = {
  seedMassFraction: 0.1,
  packagedHoneyKg: 18,
  completeJarCount: 36,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/cream-honey-packaging-yield-ratio",
  title: "Creamed Honey Packaging Yield Ratio",
  description:
    "Balance creamed-honey seed/liquid mixture and uniform process loss into complete packaging yield; no crystallization kinetics, moisture guarantee or shelf-life claim.",
  inputs: inputFields,
  outputs: [
    { id: "seedMassFraction", label: "Seed mass fraction", kind: "number" },
    { id: "packagedHoneyKg", label: "Packaged honey kg", kind: "number" },
    { id: "completeJarCount", label: "Complete jar count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      seedHoneyKg: value.seedHoneyKg as number,
      liquidHoneyKg: value.liquidHoneyKg as number,
      mixedProcessLossFraction: value.mixedProcessLossFraction as number,
      jarFillKg: value.jarFillKg as number,
    }),
});
export const run = tool.execute;
export default tool;
