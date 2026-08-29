import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FreeCashFlowInput = {
  readonly capitalExpenditures: number;
  readonly operatingCashFlow: number;
};

export type FreeCashFlowOutput = {
  readonly freeCashFlow: number;
};

export const freeCashFlowExample = {
  input: { capitalExpenditures: 30000, operatingCashFlow: 100000 },
  output: { freeCashFlow: 70000 },
} satisfies ToolExample<FreeCashFlowInput, FreeCashFlowOutput>;

export const calculateFreeCashFlow = (
  input: FreeCashFlowInput,
): FreeCashFlowOutput => {
  if (!Number.isFinite(input.operatingCashFlow))
    simpleError(
      "operatingCashFlow",
      "Operating cash flow must be finite.",
      "invalid_operating_cash_flow",
    );
  if (!Number.isFinite(input.capitalExpenditures))
    simpleError(
      "capitalExpenditures",
      "Capital expenditures must be finite.",
      "invalid_capital_expenditures",
    );
  const freeCashFlow = input.operatingCashFlow - input.capitalExpenditures;
  if (!Number.isFinite(freeCashFlow))
    simpleError(
      "operatingCashFlow",
      "Free cash flow is outside the representable numeric range.",
      "result_not_finite",
    );
  return { freeCashFlow: freeCashFlow === 0 ? 0 : freeCashFlow };
};

export const freeCashFlowTool = createSimpleTool({
  calculate: (input) =>
    calculateFreeCashFlow({
      capitalExpenditures: input.capitalExpenditures as number,
      operatingCashFlow: input.operatingCashFlow as number,
    }),
  description:
    "Calculate free cash flow as net cash provided by operating activities minus capital expenditures for the same period and currency.",
  id: "accounting/free-cash-flow-simple",
  inputs: [
    {
      description:
        "Net cash provided by operating activities for the period; outflows are entered as negative amounts.",
      id: "operatingCashFlow",
      kind: "number",
      label: "Operating cash flow",
    },
    {
      description:
        "Cash spent on capital expenditures such as property, plant, and equipment purchases for the same period.",
      id: "capitalExpenditures",
      kind: "number",
      label: "Capital expenditures",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Free cash flow: operating cash remaining after capital expenditures; negative values indicate capital spending exceeded operating cash.",
      id: "freeCashFlow",
      kind: "number",
      label: "Free cash flow",
    },
  ],
  title: "Free Cash Flow Calculator",
});
export const runFreeCashFlow = freeCashFlowTool.execute;
export default freeCashFlowTool;
