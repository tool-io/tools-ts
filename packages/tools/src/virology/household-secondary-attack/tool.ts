import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly householdIds: readonly string[];
  readonly susceptibleContacts: readonly number[];
  readonly secondaryCases: readonly number[];
}>;
export type Output = Readonly<{
  readonly householdAttackPercent: readonly number[];
  readonly pooledAttackPercent: number;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.householdIds, input.susceptibleContacts, "householdIds");
  aligned(input.householdIds, input.secondaryCases, "householdIds");
  if (new Set(input.householdIds).size !== input.householdIds.length)
    simpleError("householdIds", "One record per household required.");
  input.susceptibleContacts.forEach((v, i) => {
    count(v, "susceptibleContacts", 1);
    count(input.secondaryCases[i], "secondaryCases");
    if (input.secondaryCases[i] > v)
      simpleError(
        "secondaryCases",
        "Secondary cases cannot exceed susceptible contacts, excluding index cases.",
      );
  });
  return {
    householdAttackPercent: input.secondaryCases.map(
      (v, i) => (100 * v) / input.susceptibleContacts[i],
    ),
    pooledAttackPercent:
      (100 * input.secondaryCases.reduce((a, b) => a + b, 0)) /
      input.susceptibleContacts.reduce((a, b) => a + b, 0),
  };
};
export const exampleInput = {
  householdIds: ["A", "B"],
  susceptibleContacts: [4, 6],
  secondaryCases: [1, 3],
} satisfies Input;
export const exampleOutput = {
  householdAttackPercent: [25, 50],
  pooledAttackPercent: 40,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/household-secondary-attack",
  title: "Household Secondary Attack",
  description:
    "Summarize contact-weighted secondary attack rates excluding household index cases from the supplied denominators.",
  inputs: [
    { id: "householdIds", label: "Household ids", kind: "stringList" },
    {
      id: "susceptibleContacts",
      label: "Susceptible contacts",
      kind: "numberList",
    },
    { id: "secondaryCases", label: "Secondary cases", kind: "numberList" },
  ],
  outputs: [
    {
      id: "householdAttackPercent",
      label: "Household attack percent",
      kind: "numberList",
    },
    {
      id: "pooledAttackPercent",
      label: "Pooled attack percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      householdIds: value.householdIds as readonly string[],
      susceptibleContacts: value.susceptibleContacts as readonly number[],
      secondaryCases: value.secondaryCases as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
