import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly recoverableOreTonnes: number;
  readonly annualCapacitiesTonnes: readonly number[];
}>;
export type Output = Readonly<{
  readonly oreProcessedTonnesByYear: readonly number[];
  readonly exhaustionYearFraction: number;
}>;
const inputFields = [
  {
    id: "recoverableOreTonnes",
    label: "Recoverable ore tonnes",
    kind: "number",
  },
  {
    id: "annualCapacitiesTonnes",
    label: "Annual capacities tonnes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.recoverableOreTonnes, "recoverableOreTonnes");
  input.annualCapacitiesTonnes.forEach((v) =>
    nonnegative(v, "annualCapacitiesTonnes"),
  );
  if (!input.annualCapacitiesTonnes.length)
    simpleError("annualCapacitiesTonnes", "Nonempty capacities required.");
  let remaining = input.recoverableOreTonnes,
    exhaustionYearFraction = -1;
  const oreProcessedTonnesByYear: number[] = [];
  for (let i = 0; i < input.annualCapacitiesTonnes.length; i++) {
    const capacity = input.annualCapacitiesTonnes[i],
      processed = Math.min(remaining, capacity);
    oreProcessedTonnesByYear.push(processed);
    remaining -= processed;
    if (remaining === 0) {
      exhaustionYearFraction = i + processed / capacity;
      break;
    }
  }
  if (remaining > 0)
    simpleError(
      "annualCapacitiesTonnes",
      "Horizon does not exhaust ore; mine life is right-censored.",
    );
  return { oreProcessedTonnesByYear, exhaustionYearFraction };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  recoverableOreTonnes: 250,
  annualCapacitiesTonnes: [100, 100, 100],
} satisfies Input;
export const exampleOutput = {
  oreProcessedTonnesByYear: [100, 100, 50],
  exhaustionYearFraction: 2.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/mine-life",
  title: "Mine Life",
  description:
    "Schedule inventory against changing annual capacities and interpolate exhaustion year; insufficient horizons return censored errors.",
  inputs: inputFields,
  outputs: [
    {
      id: "oreProcessedTonnesByYear",
      label: "Ore processed tonnes by year",
      kind: "numberList",
    },
    {
      id: "exhaustionYearFraction",
      label: "Exhaustion year fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      recoverableOreTonnes: value.recoverableOreTonnes as number,
      annualCapacitiesTonnes: value.annualCapacitiesTonnes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
