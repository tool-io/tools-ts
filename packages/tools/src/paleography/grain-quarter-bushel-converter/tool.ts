import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GrainQuarterBushelConverterInput = {
  readonly amount: number;
  readonly unit?: "quarter" | "bushel" | "peck";
};

export type GrainQuarterBushelConverterOutput = {
  readonly quarters: number;
  readonly bushels: number;
  readonly pecks: number;
  readonly dryGallons: number;
};

const PECKS_PER_UNIT = { quarter: 32, bushel: 4, peck: 1 } as const;

export const calculateGrainQuarterBushelConverter = (
  input: GrainQuarterBushelConverterInput,
): GrainQuarterBushelConverterOutput => {
  if (!(
    typeof input.amount === "number" &&
    Number.isFinite(input.amount) &&
    input.amount > 0
  ))
    return simpleError(
      "amount",
      "Amount must be a finite number greater than zero.",
      "invalid_amount",
    );
  const pecks = input.amount * PECKS_PER_UNIT[input.unit ?? "quarter"];
  const output = {
    quarters: pecks / 32,
    bushels: pecks / 4,
    pecks,
    dryGallons: pecks * 2,
  };
  if (
    Object.values(output).some((value) => !Number.isFinite(value) || value <= 0)
  )
    return simpleError(
      "amount",
      "Amount is outside the representable conversion range.",
      "invalid_amount",
    );
  return output;
};

export const grainQuarterBushelConverterExample = {
  input: { amount: 3, unit: "quarter" },
  output: { quarters: 3, bushels: 24, pecks: 96, dryGallons: 192 },
} satisfies ToolExample<
  GrainQuarterBushelConverterInput,
  GrainQuarterBushelConverterOutput
>;

export const grainQuarterBushelConverterTool = createSimpleTool({
  id: "paleography/grain-quarter-bushel-converter",
  title: "Grain Quarter Bushel Converter",
  description:
    "Convert English dry grain measures on the statutory ladder 1 quarter = 8 bushels = 32 pecks = 64 (dry) gallons.",
  inputs: [
    {
      description: "Positive quantity of the chosen unit.",
      id: "amount",
      kind: "number",
      label: "Amount",
    },
    {
      default: "quarter",
      description: "Unit of the entered amount.",
      enum: ["quarter", "bushel", "peck"],
      id: "unit",
      kind: "string",
      label: "Unit",
    },
  ],
  outputs: [
    {
      description: "Volume in quarters.",
      id: "quarters",
      kind: "number",
      label: "Quarters",
    },
    {
      description: "Volume in bushels.",
      id: "bushels",
      kind: "number",
      label: "Bushels",
    },
    {
      description: "Volume in pecks.",
      id: "pecks",
      kind: "number",
      label: "Pecks",
    },
    {
      description: "Volume in dry gallons.",
      id: "dryGallons",
      kind: "number",
      label: "Dry gallons",
    },
  ],
  calculate: (input) =>
    calculateGrainQuarterBushelConverter({
      amount: input.amount as number,
      unit: input.unit as GrainQuarterBushelConverterInput["unit"],
    }),
});

export const runGrainQuarterBushelConverter =
  grainQuarterBushelConverterTool.execute;
export default grainQuarterBushelConverterTool;
