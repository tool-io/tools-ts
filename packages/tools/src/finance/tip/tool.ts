import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  money,
  roundMinor,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualTipBasisMinorUnits: number;
  readonly callerChosenTipBasisPoints: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualTipBasisMinorUnits",
    label: "Actual tip basis minor units",
    kind: "number",
  },
  {
    id: "callerChosenTipBasisPoints",
    label: "Caller chosen tip basis points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  money(input.actualTipBasisMinorUnits, "basis");
  bounded(input.callerChosenTipBasisPoints, "bps", 0, 100000);
  const t = roundMinor(
    BigInt(input.actualTipBasisMinorUnits) *
      BigInt(input.callerChosenTipBasisPoints),
    10000n,
  );
  money(input.actualTipBasisMinorUnits + t, "total");
  return {
    tipMinorUnits: t,
    totalIncludingTipMinorUnits: input.actualTipBasisMinorUnits + t,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualTipBasisMinorUnits: 100, callerChosenTipBasisPoints: 1500 },
  output: { result: { tipMinorUnits: 15, totalIncludingTipMinorUnits: 115 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "finance/tip",
  title: "Tip Amount Calculator",
  description:
    "Exacthalf-awayonecurrencytipminorunitsindependentlyselectedtipbasis/rate,no legalminimumor socialobligation. Explicitboundedofflineconvention,not authoritative external identity,eligibility,clinical or safe-use determination.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          tipMinorUnits: { type: "number" },
          totalIncludingTipMinorUnits: { type: "number" },
        },
        required: ["tipMinorUnits", "totalIncludingTipMinorUnits"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
