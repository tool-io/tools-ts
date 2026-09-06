import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  integer,
  aligned,
  money,
  sumMoney,
  roundMinor,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly unitCatalogueValuesMinor: readonly number[];
  readonly quantities: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalCatalogueValueMinor: number;
  readonly lineCatalogueValuesMinor: readonly number[];
}>;
const inputFields = [
  {
    id: "unitCatalogueValuesMinor",
    label: "Unit catalogue values minor",
    kind: "numberList",
  },
  { id: "quantities", label: "Quantities", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.quantities.forEach((v) => nonnegative(v, "quantities"));
  aligned(
    input.unitCatalogueValuesMinor,
    input.quantities,
    "unitCatalogueValuesMinor",
  );
  input.unitCatalogueValuesMinor.forEach((v) => money(v, "unitvalue"));
  input.quantities.forEach((v) => integer(v, "quantity"));
  const lines = input.quantities.map((v, i) =>
    roundMinor(BigInt(v) * BigInt(input.unitCatalogueValuesMinor[i]), 1n),
  );
  return {
    totalCatalogueValueMinor: sumMoney(lines),
    lineCatalogueValuesMinor: lines,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  unitCatalogueValuesMinor: [1000, 2000],
  quantities: [2, 3],
} satisfies Input;
export const exampleOutput = {
  totalCatalogueValueMinor: 8000,
  lineCatalogueValuesMinor: [2000, 6000],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/collection-total-aggregator",
  title: "Collection Total Catalogue Value Aggregator",
  description:
    "Sum exact caller same-edition/currency catalogue lines and physical quantities, not a liquidation value. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalCatalogueValueMinor",
      label: "Total catalogue value minor",
      kind: "number",
    },
    {
      id: "lineCatalogueValuesMinor",
      label: "Line catalogue values minor",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      unitCatalogueValuesMinor:
        value.unitCatalogueValuesMinor as readonly number[],
      quantities: value.quantities as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
