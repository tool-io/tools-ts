import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly critEligibleBaseDamage: number;
  readonly nonCritFlatDamage: number;
  readonly callerCritProbability: number;
  readonly callerCritDamageMultiplier: number;
}>;
export type Output = Readonly<{
  readonly expectedEligibleDamageMultiplier: number;
  readonly expectedTotalHitDamage: number;
  readonly hitDamageVariance: number;
}>;
const inputFields = [
  {
    id: "critEligibleBaseDamage",
    label: "Crit eligible base damage",
    kind: "number",
  },
  { id: "nonCritFlatDamage", label: "Non crit flat damage", kind: "number" },
  {
    id: "callerCritProbability",
    label: "Caller crit probability",
    kind: "number",
  },
  {
    id: "callerCritDamageMultiplier",
    label: "Caller crit damage multiplier",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.critEligibleBaseDamage, "critEligibleBaseDamage");
  nonnegative(input.nonCritFlatDamage, "nonCritFlatDamage");
  nonnegative(input.callerCritDamageMultiplier, "callerCritDamageMultiplier");
  fraction(input.callerCritProbability, "callerCritProbability");
  const p = input.callerCritProbability,
    m = 1 + p * (input.callerCritDamageMultiplier - 1),
    delta =
      input.critEligibleBaseDamage * (input.callerCritDamageMultiplier - 1);
  return {
    expectedEligibleDamageMultiplier: m,
    expectedTotalHitDamage:
      input.nonCritFlatDamage + input.critEligibleBaseDamage * m,
    hitDamageVariance: delta * delta * p * (1 - p),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  critEligibleBaseDamage: 100,
  nonCritFlatDamage: 20,
  callerCritProbability: 0.25,
  callerCritDamageMultiplier: 2,
} satisfies Input;
export const exampleOutput = {
  expectedEligibleDamageMultiplier: 1.25,
  expectedTotalHitDamage: 145,
  hitDamageVariance: 1875,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/crit-chance-expected-damage-multiplier",
  title: "Crit Chance Expected Damage Multiplier",
  description:
    "Compute explicit Bernoulli critical-hit expectation/variance while separating noncrit flat damage; multiplier can model weaker crit variants, no armor, crit dependence or guaranteed damage.",
  inputs: inputFields,
  outputs: [
    {
      id: "expectedEligibleDamageMultiplier",
      label: "Expected eligible damage multiplier",
      kind: "number",
    },
    {
      id: "expectedTotalHitDamage",
      label: "Expected total hit damage",
      kind: "number",
    },
    { id: "hitDamageVariance", label: "Hit damage variance", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      critEligibleBaseDamage: value.critEligibleBaseDamage as number,
      nonCritFlatDamage: value.nonCritFlatDamage as number,
      callerCritProbability: value.callerCritProbability as number,
      callerCritDamageMultiplier: value.callerCritDamageMultiplier as number,
    }),
});
export const run = tool.execute;
export default tool;
