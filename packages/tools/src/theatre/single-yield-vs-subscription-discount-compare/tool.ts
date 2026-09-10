import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  money,
  signedSum,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly actualSingleTicketNetYieldMinor: number;
  readonly actualMatchedSubscriptionPerPerformanceYieldMinor: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSingleTicketNetYieldMinor",
    label: "Actual single ticket net yield minor",
    kind: "number",
  },
  {
    id: "actualMatchedSubscriptionPerPerformanceYieldMinor",
    label: "Actual matched subscription per performance yield minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  money(input.actualSingleTicketNetYieldMinor, "single");
  positive(input.actualSingleTicketNetYieldMinor, "single");
  money(
    input.actualMatchedSubscriptionPerPerformanceYieldMinor,
    "subscription",
  );
  return {
    signedSingleMinusSubscriptionYieldMinor: signedSum([
      input.actualSingleTicketNetYieldMinor,
      -input.actualMatchedSubscriptionPerPerformanceYieldMinor,
    ]),
    observedSubscriptionDiscountPercent:
      (100 *
        (input.actualSingleTicketNetYieldMinor -
          input.actualMatchedSubscriptionPerPerformanceYieldMinor)) /
      input.actualSingleTicketNetYieldMinor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualSingleTicketNetYieldMinor: 100,
    actualMatchedSubscriptionPerPerformanceYieldMinor: 80,
  },
  output: {
    result: {
      signedSingleMinusSubscriptionYieldMinor: 20,
      observedSubscriptionDiscountPercent: 20,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/single-yield-vs-subscription-discount-compare",
  title: "Single Yield vs Subscription Discount Compare Tool",
  description:
    "Matched actual net per-performance ticket yields in one currency with compatible costs/seat basis. Signed discount retained; not demand forecast or optimal pricing recommendation.",
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
