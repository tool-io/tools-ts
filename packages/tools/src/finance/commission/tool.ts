import { createSimpleTool } from "../../core/simple.js";
export const commissionTool = createSimpleTool({
  id: "finance/commission",
  title: "Commission Calculator",
  description:
    "Calculate commission and total compensation from sales and a percentage rate.",
  inputs: [
    { id: "sales", label: "Sales", kind: "number" },
    {
      id: "commissionRatePercent",
      label: "Commission rate",
      kind: "number",
      unit: "%",
    },
    {
      id: "basePay",
      label: "Base pay",
      kind: "number",
      default: 0,
      required: false,
    },
  ],
  outputs: [
    { id: "commission", label: "Commission", kind: "number" },
    { id: "totalCompensation", label: "Total compensation", kind: "number" },
  ],
  calculate: (input) => {
    const commission =
      ((input.sales as number) * (input.commissionRatePercent as number)) / 100;
    return {
      commission,
      totalCompensation: commission + (input.basePay as number),
    };
  },
});
export const runCommission = commissionTool.execute;
export default commissionTool;
