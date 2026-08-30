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
  readonly calledMetalKg: number;
  readonly recoveredMetalKg: number;
  readonly metallurgicalRecoveryFraction: number;
}>;
export type Output = Readonly<{
  readonly accountedFeedMetalKg: number;
  readonly mineCallFactorPercent: number;
  readonly unaccountedMetalKg: number;
}>;
const inputFields = [
  { id: "calledMetalKg", label: "Called metal kg", kind: "number" },
  { id: "recoveredMetalKg", label: "Recovered metal kg", kind: "number" },
  {
    id: "metallurgicalRecoveryFraction",
    label: "Metallurgical recovery fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.calledMetalKg, "calledMetalKg");
  positive(
    input.metallurgicalRecoveryFraction,
    "metallurgicalRecoveryFraction",
  );
  nonnegative(input.recoveredMetalKg, "recoveredMetalKg");
  fraction(
    input.metallurgicalRecoveryFraction,
    "metallurgicalRecoveryFraction",
  );
  const accountedFeedMetalKg =
    input.recoveredMetalKg / input.metallurgicalRecoveryFraction;
  return {
    accountedFeedMetalKg,
    mineCallFactorPercent: (100 * accountedFeedMetalKg) / input.calledMetalKg,
    unaccountedMetalKg: input.calledMetalKg - accountedFeedMetalKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  calledMetalKg: 1000,
  recoveredMetalKg: 800,
  metallurgicalRecoveryFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  accountedFeedMetalKg: 1000,
  mineCallFactorPercent: 100,
  unaccountedMetalKg: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/mine-call-factor",
  title: "Mine Call Factor",
  description:
    "Reconcile called metal against recovery-corrected product metal; over-100% factors and negative discrepancies are preserved.",
  inputs: inputFields,
  outputs: [
    {
      id: "accountedFeedMetalKg",
      label: "Accounted feed metal kg",
      kind: "number",
    },
    {
      id: "mineCallFactorPercent",
      label: "Mine call factor percent",
      kind: "number",
    },
    { id: "unaccountedMetalKg", label: "Unaccounted metal kg", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      calledMetalKg: value.calledMetalKg as number,
      recoveredMetalKg: value.recoveredMetalKg as number,
      metallurgicalRecoveryFraction:
        value.metallurgicalRecoveryFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
