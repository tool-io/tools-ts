import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, money } from "../batch45-shared.js";
export type Input = Readonly<{
  readonly previousVerifiedLossCostMinor: number;
  readonly newVerifiedLossCostMinor: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "previousVerifiedLossCostMinor",
    label: "Previous verified loss cost minor",
    kind: "number",
  },
  {
    id: "newVerifiedLossCostMinor",
    label: "New verified loss cost minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  money(input.previousVerifiedLossCostMinor, "previous");
  positive(input.previousVerifiedLossCostMinor, "previous");
  money(input.newVerifiedLossCostMinor, "new");
  return {
    signedChangePercent:
      Number(
        (BigInt(input.newVerifiedLossCostMinor) -
          BigInt(input.previousVerifiedLossCostMinor)) *
          100n,
      ) / input.previousVerifiedLossCostMinor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    previousVerifiedLossCostMinor: 10000,
    newVerifiedLossCostMinor: 11000,
  },
  output: { result: { signedChangePercent: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/loss-cost-pass-through-change-percent",
  title: "Loss Cost Pass Through Change Percent Calculator",
  description:
    "Actual signed change in matched independently verified loss-cost estimates. Same exposure/coverage/currency basis required; not inferred full premium change or automatic pass-through permission.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
