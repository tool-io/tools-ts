import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  bounded,
  money,
  roundMinor,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyAssessedArvMinorUnits: number;
  readonly callerDealApplicableOfferBasisPoints: number;
  readonly actualRepairCostMinorUnits: number;
  readonly actualOtherCostReserveMinorUnits: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentlyAssessedArvMinorUnits",
    label: "Caller independently assessed arv minor units",
    kind: "number",
  },
  {
    id: "callerDealApplicableOfferBasisPoints",
    label: "Caller deal applicable offer basis points",
    kind: "number",
  },
  {
    id: "actualRepairCostMinorUnits",
    label: "Actual repair cost minor units",
    kind: "number",
  },
  {
    id: "actualOtherCostReserveMinorUnits",
    label: "Actual other cost reserve minor units",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerIndependentlyAssessedArvMinorUnits,
    "callerIndependentlyAssessedArvMinorUnits",
  );
  bounded(
    input.callerDealApplicableOfferBasisPoints,
    "callerDealApplicableOfferBasisPoints",
    0,
    1000000,
  );
  nonnegative(input.actualRepairCostMinorUnits, "actualRepairCostMinorUnits");
  nonnegative(
    input.actualOtherCostReserveMinorUnits,
    "actualOtherCostReserveMinorUnits",
  );
  return {
    value:
      roundMinor(
        BigInt(money(input.callerIndependentlyAssessedArvMinorUnits, "ARV")) *
          BigInt(
            bounded(
              input.callerDealApplicableOfferBasisPoints,
              "bps",
              0,
              10000,
            ),
          ),
        10000n,
      ) -
      money(input.actualRepairCostMinorUnits, "repairs") -
      money(input.actualOtherCostReserveMinorUnits, "reserve"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlyAssessedArvMinorUnits: 100,
    callerDealApplicableOfferBasisPoints: 8000,
    actualRepairCostMinorUnits: 10,
    actualOtherCostReserveMinorUnits: 10,
  },
  output: { result: { value: 60 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "real-estate/max-allowable-offer",
  title: "Maximum Allowable Offer Calculator",
  description:
    "Contract-specific maximum offer ledger actualARV\u00d7externally applicable fraction minus repair/reserves, exactBigInthalfawaycurrencyminorunits, signed negative offer retained. No universal70percent rule, valuation or lending approval.",
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
