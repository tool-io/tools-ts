import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  transactionAmount: number;
  feeRate: number;
  minimumFee: number;
  maximumFee: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "transactionAmount", label: "Transaction amount", kind: "number" },
  { id: "feeRate", label: "Fee rate", kind: "number" },
  { id: "minimumFee", label: "Minimum fee", kind: "number" },
  { id: "maximumFee", label: "Maximum fee", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.transactionAmount >= 0 &&
      i.feeRate >= 0 &&
      i.minimumFee >= 0 &&
      i.maximumFee >= i.minimumFee,
  );
  const raw = i.transactionAmount * i.feeRate;
  return H.finish({
    uncappedFee: raw,
    chargedFee: Math.min(i.maximumFee, Math.max(i.minimumFee, raw)),
  });
};
export const example = {
  input: {
    transactionAmount: 100,
    feeRate: 0.01,
    minimumFee: 2,
    maximumFee: 5,
  },
  output: { result: { uncappedFee: 1, chargedFee: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "finance/fee-cap-floor-single-transaction",
  title: "Finance: Fee Cap Floor Single Transaction Tool",
  description:
    "Apply a supplied proportional fee and ordered absolute floor/cap to one nonnegative transaction; not tariff research or financial advice.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          chargedFee: { type: "number" },
          uncappedFee: { type: "number" },
        },
        required: ["chargedFee", "uncappedFee"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
