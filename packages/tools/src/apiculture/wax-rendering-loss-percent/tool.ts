import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly crudeWaxMassKg: number;
  readonly crudeWaxPurityFraction: number;
  readonly refinedMassKg: number;
  readonly refinedWaxPurityFraction: number;
}>;
export type Output = Readonly<{
  readonly initialPureWaxKg: number;
  readonly recoveredPureWaxKg: number;
  readonly pureWaxLossKg: number;
  readonly pureWaxLossFraction: number;
}>;
const inputFields = [
  { id: "crudeWaxMassKg", label: "Crude wax mass kg", kind: "number" },
  {
    id: "crudeWaxPurityFraction",
    label: "Crude wax purity fraction",
    kind: "number",
  },
  { id: "refinedMassKg", label: "Refined mass kg", kind: "number" },
  {
    id: "refinedWaxPurityFraction",
    label: "Refined wax purity fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.crudeWaxMassKg, "crudeWaxMassKg");
  positive(input.crudeWaxPurityFraction, "crudeWaxPurityFraction");
  nonnegative(input.refinedMassKg, "refinedMassKg");
  fraction(input.crudeWaxPurityFraction, "crudeWaxPurityFraction");
  fraction(input.refinedWaxPurityFraction, "refinedWaxPurityFraction");
  const initialPureWaxKg = input.crudeWaxMassKg * input.crudeWaxPurityFraction,
    recoveredPureWaxKg = input.refinedMassKg * input.refinedWaxPurityFraction,
    pureWaxLossKg = nonnegative(
      initialPureWaxKg - recoveredPureWaxKg,
      "refinedMassKg",
    );
  return {
    initialPureWaxKg,
    recoveredPureWaxKg,
    pureWaxLossKg,
    pureWaxLossFraction: pureWaxLossKg / initialPureWaxKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  crudeWaxMassKg: 5,
  crudeWaxPurityFraction: 0.8,
  refinedMassKg: 3.5,
  refinedWaxPurityFraction: 0.9,
} satisfies Input;
export const exampleOutput = {
  initialPureWaxKg: 4,
  recoveredPureWaxKg: 3.15,
  pureWaxLossKg: 0.85,
  pureWaxLossFraction: 0.2125,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/wax-rendering-loss-percent",
  title: "Wax Rendering Loss Percent",
  description:
    "Measure purity-corrected rendering wax losses instead of calling all crude-to-refined mass loss wax loss; matched material basis and assay representativeness are caller responsibilities.",
  inputs: inputFields,
  outputs: [
    { id: "initialPureWaxKg", label: "Initial pure wax kg", kind: "number" },
    {
      id: "recoveredPureWaxKg",
      label: "Recovered pure wax kg",
      kind: "number",
    },
    { id: "pureWaxLossKg", label: "Pure wax loss kg", kind: "number" },
    {
      id: "pureWaxLossFraction",
      label: "Pure wax loss fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      crudeWaxMassKg: value.crudeWaxMassKg as number,
      crudeWaxPurityFraction: value.crudeWaxPurityFraction as number,
      refinedMassKg: value.refinedMassKg as number,
      refinedWaxPurityFraction: value.refinedWaxPurityFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
