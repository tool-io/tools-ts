import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  money,
  roundMinor,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualQualifiedPromotableResidualMinorUnits: number;
  readonly callerContractPromoteBasisPoints: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualQualifiedPromotableResidualMinorUnits",
    label: "Actual qualified pro mot able residual minor units",
    kind: "number",
  },
  {
    id: "callerContractPromoteBasisPoints",
    label: "Caller contract promote basis points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  money(input.actualQualifiedPromotableResidualMinorUnits, "residual");
  bounded(input.callerContractPromoteBasisPoints, "bps", 0, 10000);
  const p = roundMinor(
    BigInt(input.actualQualifiedPromotableResidualMinorUnits) *
      BigInt(input.callerContractPromoteBasisPoints),
    10000n,
  );
  return {
    actualPromoteMinorUnits: p,
    remainingResidualMinorUnits:
      input.actualQualifiedPromotableResidualMinorUnits - p,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualQualifiedPromotableResidualMinorUnits: 100,
    callerContractPromoteBasisPoints: 2000,
  },
  output: {
    result: { actualPromoteMinorUnits: 20, remainingResidualMinorUnits: 80 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "real-estate/promote",
  title: "Promote Calculator",
  description:
    "Contract independently qualified pro mot able residual\u00d7actual promote basis points, exact half away minor units. No hurdle/catchup/entitlement or agreement inferred.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
