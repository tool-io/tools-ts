import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  bounded,
  money,
  roundMinor,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualChargeMinorUnits: number;
  readonly callerApplicablePenaltyBasisPoints: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualChargeMinorUnits",
    label: "Actual charge minor units",
    kind: "number",
  },
  {
    id: "callerApplicablePenaltyBasisPoints",
    label: "Caller applicable penalty basis points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(input.actualChargeMinorUnits, "actualChargeMinorUnits");
  bounded(
    input.callerApplicablePenaltyBasisPoints,
    "callerApplicablePenaltyBasisPoints",
    0,
    1000000,
  );
  return {
    value: roundMinor(
      BigInt(money(input.actualChargeMinorUnits, "charge")) *
        BigInt(
          bounded(input.callerApplicablePenaltyBasisPoints, "bps", 0, 10000),
        ),
      10000n,
    ),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualChargeMinorUnits: 100,
    callerApplicablePenaltyBasisPoints: 1000,
  },
  output: { result: { value: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/power-factor-penalty",
  title: "Power Factor Penalty Calculator",
  description:
    "Actual independently applicable tariff charge\u00d7penalty basis points, one currency safe integer minor units, exact BigIntand half away rounding; not derive tariff from power factor. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
