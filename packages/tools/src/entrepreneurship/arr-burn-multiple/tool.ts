import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { nonnegative, positive } from "../shared.js";

export type Input = Readonly<{
  readonly netCashBurn: number;
  readonly netNewArr: number;
}>;
export type Output = Readonly<{
  readonly burnMultiple: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.netCashBurn, "netCashBurn");
  positive(input.netNewArr, "netNewArr");
  return { burnMultiple: input.netCashBurn / input.netNewArr };
};
export const exampleInput = {
  netCashBurn: 200000,
  netNewArr: 100000,
} satisfies Input;
export const exampleOutput = { burnMultiple: 2 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/arr-burn-multiple",
  title: "ARR Burn Multiple",
  description:
    "Compute cash burned per unit of net new ARR over a consistently measured period.",
  inputs: [
    { id: "netCashBurn", label: "Net cash burn", kind: "number" },
    { id: "netNewArr", label: "Net new arr", kind: "number" },
  ],
  outputs: [{ id: "burnMultiple", label: "Burn multiple", kind: "number" }],
  calculate: (value) =>
    calculate({
      netCashBurn: value.netCashBurn as number,
      netNewArr: value.netNewArr as number,
    }),
});
export const run = tool.execute;
export default tool;
