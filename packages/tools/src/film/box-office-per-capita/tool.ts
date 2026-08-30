import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BoxOfficePerCapitaInput = Readonly<{
  readonly grossCurrencyUnits: number;
  readonly population: number;
}>;
export type BoxOfficePerCapitaOutput = Readonly<{
  readonly grossPerPerson: number;
}>;

export const calculateBoxOfficePerCapita = (
  x: BoxOfficePerCapitaInput,
): BoxOfficePerCapitaOutput => {
  if (!Number.isFinite(x.grossCurrencyUnits) || x.grossCurrencyUnits < 0)
    simpleError("grossCurrencyUnits", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.population) || x.population < 1)
    simpleError("population", "Provide a finite number at least 1.");
  if (!Number.isSafeInteger(x.population))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const grossPerPerson = x.grossCurrencyUnits / x.population;
  if (!Number.isFinite(grossPerPerson))
    simpleError(
      "grossPerPerson",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { grossPerPerson: Object.is(grossPerPerson, -0) ? 0 : grossPerPerson };
};

export const example = {
  input: { grossCurrencyUnits: 1000000, population: 100000 },
  output: { grossPerPerson: 10 },
} satisfies ToolExample<BoxOfficePerCapitaInput, BoxOfficePerCapitaOutput>;

export const tool = createSimpleTool({
  id: "film/box-office-per-capita",
  title: "Box Office Per Capita",
  description:
    "Gross theatrical receipts per resident in the specified market and period; all gross inputs must use one currency.",
  inputs: [
    {
      id: "grossCurrencyUnits",
      kind: "number",
      label: "Gross Currency Units",
      unit: "currency",
      minimum: 0,
    },
    { id: "population", kind: "integer", label: "Population", minimum: 1 },
  ],
  outputs: [
    {
      id: "grossPerPerson",
      kind: "number",
      label: "Gross Per Person",
      unit: "currency/person",
    },
  ],
  calculate: (input) =>
    calculateBoxOfficePerCapita({
      grossCurrencyUnits: input.grossCurrencyUnits as number,
      population: input.population as number,
    }),
});
export const boxOfficePerCapitaTool = tool;
export const runBoxOfficePerCapita = tool.execute;
export default tool;
