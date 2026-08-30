import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NetRentalIncomeInput = Readonly<{
  readonly grossPotentialRent: number;
  readonly operatingExpenses: number;
  readonly vacancyLoss: number;
  readonly collectionLoss: number;
}>;
export type NetRentalIncomeOutput = Readonly<{
  readonly netRentalIncome: number;
}>;

export const calculateNetRentalIncome = (
  x: NetRentalIncomeInput,
): NetRentalIncomeOutput => {
  if (!Number.isFinite(x.grossPotentialRent) || x.grossPotentialRent < 0)
    simpleError("grossPotentialRent", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.operatingExpenses) || x.operatingExpenses < 0)
    simpleError("operatingExpenses", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.vacancyLoss) || x.vacancyLoss < 0)
    simpleError("vacancyLoss", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.collectionLoss) || x.collectionLoss < 0)
    simpleError("collectionLoss", "Provide a finite nonnegative number.");
  const netRentalIncome =
    x.grossPotentialRent -
    x.operatingExpenses -
    x.vacancyLoss -
    x.collectionLoss;
  if (!Number.isFinite(netRentalIncome))
    simpleError(
      "netRentalIncome",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    netRentalIncome: Object.is(netRentalIncome, -0) ? 0 : netRentalIncome,
  };
};

export const example = {
  input: {
    grossPotentialRent: 100000,
    operatingExpenses: 35000,
    vacancyLoss: 5000,
    collectionLoss: 1000,
  },
  output: { netRentalIncome: 59000 },
} satisfies ToolExample<NetRentalIncomeInput, NetRentalIncomeOutput>;

export const tool = createSimpleTool({
  id: "real-estate/net-rental-income",
  title: "Net Rental Income",
  description:
    "Rental cash income after operating expenses, vacancy loss and collection loss; excludes financing.",
  inputs: [
    {
      id: "grossPotentialRent",
      kind: "number",
      label: "Gross Potential Rent",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "operatingExpenses",
      kind: "number",
      label: "Operating Expenses",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "vacancyLoss",
      kind: "number",
      label: "Vacancy Loss",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "collectionLoss",
      kind: "number",
      label: "Collection Loss",
      unit: "currency",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "netRentalIncome",
      kind: "number",
      label: "Net Rental Income",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateNetRentalIncome({
      grossPotentialRent: input.grossPotentialRent as number,
      operatingExpenses: input.operatingExpenses as number,
      vacancyLoss: input.vacancyLoss as number,
      collectionLoss: input.collectionLoss as number,
    }),
});
export const netRentalIncomeTool = tool;
export const runNetRentalIncome = tool.execute;
export default tool;
