import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { parsePlainDate } from "../../core/date.js";
export const fiscalQuarterTool = createSimpleTool({
  id: "date/fiscal-quarter",
  title: "Fiscal Quarter Calculator",
  description:
    "Return the fiscal quarter (1-4) of an ISO calendar date for a fiscal year that starts in a chosen month.",
  inputs: [
    { id: "date", label: "Date", kind: "string", format: "date" },
    {
      default: 1,
      description: "Month number (1-12) in which the fiscal year starts.",
      id: "startMonth",
      label: "Fiscal year start month",
      kind: "integer",
      maximum: 12,
      minimum: 1,
    },
  ],
  outputs: [{ id: "quarter", label: "Fiscal quarter", kind: "integer" }],
  calculate: (input) => {
    const month =
      new Date(parsePlainDate(input.date as string)).getUTCMonth() + 1;
    const startMonth = input.startMonth as number;
    return {
      quarter: Math.floor(((month - startMonth + 12) % 12) / 3) + 1,
    };
  },
});
export const runFiscalQuarter = fiscalQuarterTool.execute;
export default fiscalQuarterTool;

export type FiscalQuarterInput = {
  readonly date: string;
  readonly startMonth: number;
};

export type FiscalQuarterOutput = {
  readonly quarter: number;
};

export const fiscalQuarterExample = {
  input: {
    date: "2024-01-15",
    startMonth: 1,
  },
  output: {
    quarter: 1,
  },
} satisfies ToolExample<FiscalQuarterInput, FiscalQuarterOutput>;
