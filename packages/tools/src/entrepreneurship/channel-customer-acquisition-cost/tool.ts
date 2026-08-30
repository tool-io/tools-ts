import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly channelNames: readonly string[];
  readonly channelSpend: readonly number[];
  readonly newCustomers: readonly number[];
}>;
export type Output = Readonly<{
  readonly channelCac: readonly number[];
  readonly blendedCac: number;
  readonly acquiredCustomers: number;
}>;
export const calculate = (input: Input): Output => {
  const n = input.channelNames.length;
  if (
    !n ||
    n !== input.channelSpend.length ||
    n !== input.newCustomers.length ||
    new Set(input.channelNames).size !== n ||
    input.channelSpend.some((v) => v < 0) ||
    input.newCustomers.some((v) => !Number.isSafeInteger(v) || v <= 0)
  )
    simpleError(
      "newCustomers",
      "Distinct channels, nonnegative spend and positive acquired counts required.",
    );
  const acquiredCustomers = input.newCustomers.reduce((a, b) => a + b, 0);
  return {
    channelCac: input.channelSpend.map((v, i) => v / input.newCustomers[i]),
    blendedCac:
      input.channelSpend.reduce((a, b) => a + b, 0) / acquiredCustomers,
    acquiredCustomers,
  };
};
export const exampleInput = {
  channelNames: ["paid-search", "referrals"],
  channelSpend: [100, 100],
  newCustomers: [10, 10],
} satisfies Input;
export const exampleOutput = {
  channelCac: [10, 10],
  blendedCac: 10,
  acquiredCustomers: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/channel-customer-acquisition-cost",
  title: "Channel Customer Acquisition Cost",
  description:
    "Break out customer acquisition cost by channel and across all channels.",
  inputs: [
    { id: "channelNames", label: "Channel names", kind: "stringList" },
    { id: "channelSpend", label: "Channel spend", kind: "numberList" },
    { id: "newCustomers", label: "New customers", kind: "numberList" },
  ],
  outputs: [
    { id: "channelCac", label: "Channel cac", kind: "numberList" },
    { id: "blendedCac", label: "Blended cac", kind: "number" },
    { id: "acquiredCustomers", label: "Acquired customers", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      channelNames: value.channelNames as readonly string[],
      channelSpend: value.channelSpend as readonly number[],
      newCustomers: value.newCustomers as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
