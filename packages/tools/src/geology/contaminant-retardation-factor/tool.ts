import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly dryBulkDensityKgM3: number;
  readonly linearKdM3Kg: number;
  readonly transportPorosity: number;
}>;
export type Output = Readonly<{ readonly retardationFactor: number }>;
const inputFields = [
  { id: "dryBulkDensityKgM3", label: "Dry bulk density kg m3", kind: "number" },
  { id: "linearKdM3Kg", label: "Linear kd m3 kg", kind: "number" },
  { id: "transportPorosity", label: "Transport porosity", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.dryBulkDensityKgM3, "dryBulkDensityKgM3");
  positive(input.transportPorosity, "transportPorosity");
  nonnegative(input.linearKdM3Kg, "linearKdM3Kg");
  fraction(input.transportPorosity, "porosity");
  return {
    retardationFactor:
      1 +
      (input.dryBulkDensityKgM3 * input.linearKdM3Kg) / input.transportPorosity,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dryBulkDensityKgM3: 1000,
  linearKdM3Kg: 0.001,
  transportPorosity: 0.5,
} satisfies Input;
export const exampleOutput = { retardationFactor: 3 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/contaminant-retardation-factor",
  title: "Geology Contaminant Retardation Factor Calculator",
  description:
    "Equilibrium linear sorption R=1+rhoDryKd/nEffective, independently calibrated contaminant/medium Kd, not reactive kinetics. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "retardationFactor", label: "Retardation factor", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      dryBulkDensityKgM3: value.dryBulkDensityKgM3 as number,
      linearKdM3Kg: value.linearKdM3Kg as number,
      transportPorosity: value.transportPorosity as number,
    }),
});
export const run = tool.execute;
export default tool;
