import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PitiInput = Readonly<{
  readonly principalAndInterest: number;
  readonly propertyTaxMonthly: number;
  readonly insuranceMonthly: number;
}>;
export type PitiOutput = Readonly<{
  readonly pitiMonthly: number;
}>;

export const calculatePiti = (x: PitiInput): PitiOutput => {
  if (!Number.isFinite(x.principalAndInterest) || x.principalAndInterest < 0)
    simpleError("principalAndInterest", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.propertyTaxMonthly) || x.propertyTaxMonthly < 0)
    simpleError("propertyTaxMonthly", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.insuranceMonthly) || x.insuranceMonthly < 0)
    simpleError("insuranceMonthly", "Provide a finite nonnegative number.");
  const pitiMonthly =
    x.principalAndInterest + x.propertyTaxMonthly + x.insuranceMonthly;
  if (!Number.isFinite(pitiMonthly))
    simpleError(
      "pitiMonthly",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { pitiMonthly: Object.is(pitiMonthly, -0) ? 0 : pitiMonthly };
};

export const example = {
  input: {
    principalAndInterest: 1200,
    propertyTaxMonthly: 200,
    insuranceMonthly: 100,
  },
  output: { pitiMonthly: 1500 },
} satisfies ToolExample<PitiInput, PitiOutput>;

export const tool = createSimpleTool({
  id: "real-estate/piti",
  title: "Piti",
  description:
    "Monthly principal, interest, property tax and insurance from separately supplied monthly amounts; excludes HOA and mortgage insurance.",
  inputs: [
    {
      id: "principalAndInterest",
      kind: "number",
      label: "Principal And Interest",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "propertyTaxMonthly",
      kind: "number",
      label: "Property Tax Monthly",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "insuranceMonthly",
      kind: "number",
      label: "Insurance Monthly",
      unit: "currency",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "pitiMonthly",
      kind: "number",
      label: "Piti Monthly",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculatePiti({
      principalAndInterest: input.principalAndInterest as number,
      propertyTaxMonthly: input.propertyTaxMonthly as number,
      insuranceMonthly: input.insuranceMonthly as number,
    }),
});
export const pitiTool = tool;
export const runPiti = tool.execute;
export default tool;
