import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MedievalCurrencyDenaroConverterInput = {
  readonly amount: number;
  readonly unit?: "denaro" | "solido" | "lira";
};

export type MedievalCurrencyDenaroConverterOutput = {
  readonly totalDenari: number;
  readonly totalSolidi: number;
  readonly lsdNotation: string;
};

const DENARI_PER_UNIT = { denaro: 1, solido: 12, lira: 240 } as const;

export const calculateMedievalCurrencyDenaroConverter = (
  input: MedievalCurrencyDenaroConverterInput,
): MedievalCurrencyDenaroConverterOutput => {
  if (!(Number.isFinite(input.amount) && input.amount >= 0))
    return simpleError(
      "amount",
      "Amount must be a finite non-negative number.",
      "invalid_amount",
    );
  const unit = input.unit ?? "denaro";
  if (unit !== "denaro" && unit !== "solido" && unit !== "lira")
    return simpleError(
      "unit",
      "Choose denaro, solido, or lira.",
      "invalid_unit",
    );
  const totalDenari = input.amount * DENARI_PER_UNIT[unit];
  if (!Number.isFinite(totalDenari))
    return simpleError(
      "amount",
      "The converted amount exceeds the numeric range.",
      "numeric_overflow",
    );
  const librae = Math.floor(totalDenari / 240);
  const rest = totalDenari - librae * 240;
  const solidi = Math.floor(rest / 12);
  const denari = rest - solidi * 12;
  const parts: string[] = [];
  if (librae > 0) parts.push(`${librae}lb`);
  if (solidi > 0) parts.push(`${solidi}s`);
  if (denari !== 0) parts.push(`${denari}d`);
  return {
    totalDenari,
    totalSolidi: totalDenari / 12,
    lsdNotation: parts.length > 0 ? parts.join(" ") : "0d",
  };
};

export const medievalCurrencyDenaroConverterExample = {
  input: { amount: 2.5, unit: "solido" },
  output: { totalDenari: 30, totalSolidi: 2.5, lsdNotation: "2s 6d" },
} satisfies ToolExample<
  MedievalCurrencyDenaroConverterInput,
  MedievalCurrencyDenaroConverterOutput
>;

export const medievalCurrencyDenaroConverterTool = createSimpleTool({
  id: "paleography/medieval-currency-denaro-converter",
  title: "Medieval Currency Denaro Converter",
  description:
    "Convert amounts in the medieval money-of-account ladder 1 lira/libra = 20 solidi = 240 denari and render the pounds-shillings-pence notation (lb/s/d).",
  inputs: [
    {
      description: "Quantity of the chosen unit.",
      id: "amount",
      kind: "number",
      label: "Amount",
      minimum: 0,
    },
    {
      default: "denaro",
      description: "Unit of the entered amount.",
      enum: ["denaro", "solido", "lira"],
      id: "unit",
      kind: "string",
      label: "Unit",
    },
  ],
  outputs: [
    {
      description: "Total value in denari.",
      id: "totalDenari",
      kind: "number",
      label: "Denari",
    },
    {
      description: "Total value in solidi.",
      id: "totalSolidi",
      kind: "number",
      label: "Solidi",
    },
    {
      description: "Value as lb/s/d notation with zero parts omitted.",
      id: "lsdNotation",
      kind: "string",
      label: "LSD notation",
    },
  ],
  calculate: (input) =>
    calculateMedievalCurrencyDenaroConverter({
      amount: input.amount as number,
      unit: input.unit as MedievalCurrencyDenaroConverterInput["unit"],
    }),
});

export const runMedievalCurrencyDenaroConverter =
  medievalCurrencyDenaroConverterTool.execute;
export default medievalCurrencyDenaroConverterTool;
