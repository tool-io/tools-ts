import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly reactiveNitrogenInputMassesKg: readonly number[];
  readonly harvestedProductNitrogenKg: number;
  readonly soilNitrogenStockChangeKg: number;
  readonly marketableProductMassKg: number;
}>;
export type Output = Readonly<{
  readonly totalDeclaredReactiveNitrogenInputKg: number;
  readonly signedUnaccountedNitrogenKg: number;
  readonly signedUnaccountedNitrogenKgPerProductKg: number;
  readonly harvestedNitrogenRecoveryFraction: number;
}>;
const inputFields = [
  {
    id: "reactiveNitrogenInputMassesKg",
    label: "Reactive nitrogen input masses kg",
    kind: "numberList",
  },
  {
    id: "harvestedProductNitrogenKg",
    label: "Harvested product nitrogen kg",
    kind: "number",
  },
  {
    id: "soilNitrogenStockChangeKg",
    label: "Soil nitrogen stock change kg",
    kind: "number",
  },
  {
    id: "marketableProductMassKg",
    label: "Marketable product mass kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.marketableProductMassKg, "marketableProductMassKg");
  input.reactiveNitrogenInputMassesKg.forEach((v) =>
    nonnegative(v, "reactiveNitrogenInputMassesKg"),
  );
  nonnegative(input.harvestedProductNitrogenKg, "harvestedProductNitrogenKg");
  const totalDeclaredReactiveNitrogenInputKg = positive(
      input.reactiveNitrogenInputMassesKg.reduce((a, b) => a + b, 0),
      "nitrogenInputs",
    ),
    signedUnaccountedNitrogenKg =
      totalDeclaredReactiveNitrogenInputKg -
      input.harvestedProductNitrogenKg -
      input.soilNitrogenStockChangeKg;
  return {
    totalDeclaredReactiveNitrogenInputKg,
    signedUnaccountedNitrogenKg,
    signedUnaccountedNitrogenKgPerProductKg:
      signedUnaccountedNitrogenKg / input.marketableProductMassKg,
    harvestedNitrogenRecoveryFraction:
      input.harvestedProductNitrogenKg / totalDeclaredReactiveNitrogenInputKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  reactiveNitrogenInputMassesKg: [10, 20],
  harvestedProductNitrogenKg: 15,
  soilNitrogenStockChangeKg: 5,
  marketableProductMassKg: 5,
} satisfies Input;
export const exampleOutput = {
  totalDeclaredReactiveNitrogenInputKg: 30,
  signedUnaccountedNitrogenKg: 10,
  signedUnaccountedNitrogenKgPerProductKg: 2,
  harvestedNitrogenRecoveryFraction: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/nitrogen-footprint",
  title: "Agriculture Nitrogen Footprint",
  description:
    "Audit declared N input/product/soil-stock balance and signed unaccounted residual per product mass; residual is not automatically environmental emission, and above-unit recovery may reveal stock depletion or omitted inputs.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalDeclaredReactiveNitrogenInputKg",
      label: "Total declared reactive nitrogen input kg",
      kind: "number",
    },
    {
      id: "signedUnaccountedNitrogenKg",
      label: "Signed unaccounted nitrogen kg",
      kind: "number",
    },
    {
      id: "signedUnaccountedNitrogenKgPerProductKg",
      label: "Signed unaccounted nitrogen kg per product kg",
      kind: "number",
    },
    {
      id: "harvestedNitrogenRecoveryFraction",
      label: "Harvested nitrogen recovery fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      reactiveNitrogenInputMassesKg:
        value.reactiveNitrogenInputMassesKg as readonly number[],
      harvestedProductNitrogenKg: value.harvestedProductNitrogenKg as number,
      soilNitrogenStockChangeKg: value.soilNitrogenStockChangeKg as number,
      marketableProductMassKg: value.marketableProductMassKg as number,
    }),
});
export const run = tool.execute;
export default tool;
