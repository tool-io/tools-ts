import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aba } from "../batch-shared.js";
export type Input = Readonly<{ readonly routingNumberText: string }>;
export type Output = Readonly<{
  readonly weightedRoutingChecksumMatches: boolean;
  readonly checksumRemainder: number;
  readonly nonzeroRoutingDigitsObserved: boolean;
}>;
const inputFields = [
  { id: "routingNumberText", label: "Routing number text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const valid = aba(input.routingNumberText),
    remainder =
      [...input.routingNumberText].reduce(
        (s, c, i) => s + Number(c) * [3, 7, 1][i % 3],
        0,
      ) % 10;
  return {
    weightedRoutingChecksumMatches: valid,
    checksumRemainder: remainder,
    nonzeroRoutingDigitsObserved: /[1-9]/.test(input.routingNumberText),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { routingNumberText: "021000021" } satisfies Input;
export const exampleOutput = {
  weightedRoutingChecksumMatches: true,
  checksumRemainder: 0,
  nonzeroRoutingDigitsObserved: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/aba-routing-checksum-validator",
  title: "ABA Routing Checksum Validator",
  description:
    "Validate exact nine-digit ABA 3/7/1 checksum, preserving leading zeros and exposing all-zero input separately; not directory assignment, routing-prefix eligibility, bank identity or Fedwire participation verification.",
  inputs: inputFields,
  outputs: [
    {
      id: "weightedRoutingChecksumMatches",
      label: "Weighted routing checksum matches",
      kind: "boolean",
    },
    { id: "checksumRemainder", label: "Checksum remainder", kind: "number" },
    {
      id: "nonzeroRoutingDigitsObserved",
      label: "Nonzero routing digits observed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({ routingNumberText: value.routingNumberText as string }),
});
export const run = tool.execute;
export default tool;
