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
  readonly preferencePayout: number;
  readonly participationPayout: number;
  readonly preferredTotal: number;
  readonly commonPayout: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.exitProceeds, "exitProceeds");
  nonnegative(input.investedCapital, "investedCapital");
  positive(input.preferenceMultiple, "preferenceMultiple");
  fraction(input.ownershipFraction, "ownershipFraction");
  const preferencePayout = Math.min(
      input.exitProceeds,
      input.investedCapital * input.preferenceMultiple,
    ),
    participationPayout =
      (input.exitProceeds - preferencePayout) * input.ownershipFraction,
    preferredTotal = preferencePayout + participationPayout;
  return {
    preferencePayout,
    participationPayout,
    preferredTotal,
    commonPayout: input.exitProceeds - preferredTotal,
  };
};
export const exampleInput = {
  exitProceeds: 1000,
  investedCapital: 200,
  preferenceMultiple: 1,
  ownershipFraction: 0.2,
} satisfies Input;
export const exampleOutput = {
  preferencePayout: 200,
  participationPayout: 160,
  preferredTotal: 360,
  commonPayout: 640,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/participating-preferred-payout",
  title: "Participating Preferred Payout",
  description:
    "Model one uncapped participating preferred class with preference then residual participation.",
  inputs: [
    { id: "exitProceeds", label: "Exit proceeds", kind: "number" },
    { id: "investedCapital", label: "Invested capital", kind: "number" },
    { id: "preferenceMultiple", label: "Preference multiple", kind: "number" },
    { id: "ownershipFraction", label: "Ownership fraction", kind: "number" },
  ],
  outputs: [
    { id: "preferencePayout", label: "Preference payout", kind: "number" },
    {
      id: "participationPayout",
      label: "Participation payout",
      kind: "number",
    },
    { id: "preferredTotal", label: "Preferred total", kind: "number" },
    { id: "commonPayout", label: "Common payout", kind: "number" },
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
