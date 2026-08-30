import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { nonnegative, positive, fraction } from "../shared.js";

export type Input = Readonly<{
  readonly exitProceeds: number;
  readonly investedCapital: number;
  readonly preferenceMultiple: number;
  readonly ownershipFraction: number;
}>;
export type Output = Readonly<{
  readonly preferredPayout: number;
  readonly commonPayout: number;
  readonly converted: boolean;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.exitProceeds, "exitProceeds");
  nonnegative(input.investedCapital, "investedCapital");
  positive(input.preferenceMultiple, "preferenceMultiple");
  fraction(input.ownershipFraction, "ownershipFraction");
  const preference = Math.min(
      input.exitProceeds,
      input.investedCapital * input.preferenceMultiple,
    ),
    conversion = input.exitProceeds * input.ownershipFraction,
    preferredPayout = Math.max(preference, conversion);
  return {
    preferredPayout,
    commonPayout: input.exitProceeds - preferredPayout,
    converted: conversion > preference,
  };
};
export const exampleInput = {
  exitProceeds: 1000,
  investedCapital: 200,
  preferenceMultiple: 1,
  ownershipFraction: 0.2,
} satisfies Input;
export const exampleOutput = {
  preferredPayout: 200,
  commonPayout: 800,
  converted: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/nonparticipating-preferred-payout",
  title: "Nonparticipating Preferred Payout",
  description:
    "Model one nonparticipating preferred class choosing liquidation preference or conversion.",
  inputs: [
    { id: "exitProceeds", label: "Exit proceeds", kind: "number" },
    { id: "investedCapital", label: "Invested capital", kind: "number" },
    { id: "preferenceMultiple", label: "Preference multiple", kind: "number" },
    { id: "ownershipFraction", label: "Ownership fraction", kind: "number" },
  ],
  outputs: [
    { id: "preferredPayout", label: "Preferred payout", kind: "number" },
    { id: "commonPayout", label: "Common payout", kind: "number" },
    { id: "converted", label: "Converted", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      exitProceeds: value.exitProceeds as number,
      investedCapital: value.investedCapital as number,
      preferenceMultiple: value.preferenceMultiple as number,
      ownershipFraction: value.ownershipFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
