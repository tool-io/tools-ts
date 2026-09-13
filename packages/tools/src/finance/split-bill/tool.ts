import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  splitMinor,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualTotalBillMinorUnits: number;
  readonly callerActualEqualPayerCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualTotalBillMinorUnits",
    label: "Actual total bill minor units",
    kind: "number",
  },
  {
    id: "callerActualEqualPayerCount",
    label: "Caller actual equal payer count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(input.callerActualEqualPayerCount, "payers", 1, 64);
  return {
    payerAmountsMinorUnits: splitMinor(
      input.actualTotalBillMinorUnits,
      Array(input.callerActualEqualPayerCount).fill(1),
    ),
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualTotalBillMinorUnits: 100, callerActualEqualPayerCount: 3 },
  output: { result: { payerAmountsMinorUnits: [34, 33, 33] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "finance/split-bill",
  title: "Bill Split Calculator",
  description:
    "Exactequalbillsplitconservingminorunitsstablefirstpayerresidual,not virtualfractionalcents or inferredliability. Explicitboundedofflineconvention,not authoritative external identity,eligibility,clinical or safe-use determination.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
