import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly initialVolatileMassFraction: number;
  readonly initialMagmaMassKg: number;
  readonly dissolvedVolatileCapacityFractionInResidualMelt: number;
}>;
export type Output = Readonly<{
  readonly exsolvedVolatileMassKg: number;
  readonly dissolvedVolatileMassKg: number;
  readonly exsolvedFractionOfInitialVolatile: number;
}>;
const inputFields = [
  {
    id: "initialVolatileMassFraction",
    label: "Initial volatile mass fraction",
    kind: "number",
  },
  { id: "initialMagmaMassKg", label: "Initial magma mass kg", kind: "number" },
  {
    id: "dissolvedVolatileCapacityFractionInResidualMelt",
    label: "Dissolved volatile capacity fraction in residual melt",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.initialMagmaMassKg, "initialMagmaMassKg");
  positive(input.initialVolatileMassFraction, "initialVolatileMassFraction");
  fraction(input.initialVolatileMassFraction, "initialVolatileMassFraction");
  fraction(
    input.dissolvedVolatileCapacityFractionInResidualMelt,
    "dissolvedVolatileCapacityFractionInResidualMelt",
  );
  if (
    input.initialVolatileMassFraction >= 1 ||
    input.dissolvedVolatileCapacityFractionInResidualMelt >= 1 ||
    input.dissolvedVolatileCapacityFractionInResidualMelt >
      input.initialVolatileMassFraction
  )
    simpleError(
      "fractions",
      "Initial magma includes nonvolatile melt and residual saturation capacity cannot exceed initial volatile fraction.",
    );
  const exsolvedVolatileMassKg =
      (input.initialMagmaMassKg *
        (input.initialVolatileMassFraction -
          input.dissolvedVolatileCapacityFractionInResidualMelt)) /
      (1 - input.dissolvedVolatileCapacityFractionInResidualMelt),
    dissolvedVolatileMassKg =
      input.initialMagmaMassKg * input.initialVolatileMassFraction -
      exsolvedVolatileMassKg;
  return {
    exsolvedVolatileMassKg,
    dissolvedVolatileMassKg,
    exsolvedFractionOfInitialVolatile:
      exsolvedVolatileMassKg /
      (input.initialMagmaMassKg * input.initialVolatileMassFraction),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialVolatileMassFraction: 0.1,
  initialMagmaMassKg: 100,
  dissolvedVolatileCapacityFractionInResidualMelt: 0.05,
} satisfies Input;
export const exampleOutput = {
  exsolvedVolatileMassKg: 5.2631578947368425,
  dissolvedVolatileMassKg: 4.7368421052631575,
  exsolvedFractionOfInitialVolatile: 0.5263157894736842,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/volatile-solubility-degassing-fraction",
  title: "Volatile Solubility Degassing Fraction",
  description:
    "Solve single-volatile closed-system exsolution conserving nonvolatile melt while saturation is defined on residual melt mass; not a naive initial-fraction difference or a pressure-solubility reference table.",
  inputs: inputFields,
  outputs: [
    {
      id: "exsolvedVolatileMassKg",
      label: "Exsolved volatile mass kg",
      kind: "number",
    },
    {
      id: "dissolvedVolatileMassKg",
      label: "Dissolved volatile mass kg",
      kind: "number",
    },
    {
      id: "exsolvedFractionOfInitialVolatile",
      label: "Exsolved fraction of initial volatile",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialVolatileMassFraction: value.initialVolatileMassFraction as number,
      initialMagmaMassKg: value.initialMagmaMassKg as number,
      dissolvedVolatileCapacityFractionInResidualMelt:
        value.dissolvedVolatileCapacityFractionInResidualMelt as number,
    }),
});
export const run = tool.execute;
export default tool;
