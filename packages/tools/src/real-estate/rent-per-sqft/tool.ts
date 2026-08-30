import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RentPerSqftInput = Readonly<{
  readonly annualRent: number;
  readonly rentableSquareFeet: number;
}>;
export type RentPerSqftOutput = Readonly<{
  readonly annualRentPerSquareFoot: number;
}>;

export const calculateRentPerSqft = (
  x: RentPerSqftInput,
): RentPerSqftOutput => {
  if (!Number.isFinite(x.annualRent) || x.annualRent < 0)
    simpleError("annualRent", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.rentableSquareFeet) || x.rentableSquareFeet <= 0)
    simpleError("rentableSquareFeet", "Provide a finite positive number.");
  const annualRentPerSquareFoot = x.annualRent / x.rentableSquareFeet;
  if (!Number.isFinite(annualRentPerSquareFoot))
    simpleError(
      "annualRentPerSquareFoot",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    annualRentPerSquareFoot: Object.is(annualRentPerSquareFoot, -0)
      ? 0
      : annualRentPerSquareFoot,
  };
};

export const example = {
  input: {
    annualRent: 24000,
    rentableSquareFeet: 1000,
  },
  output: { annualRentPerSquareFoot: 24 },
} satisfies ToolExample<RentPerSqftInput, RentPerSqftOutput>;

export const tool = createSimpleTool({
  id: "real-estate/rent-per-sqft",
  title: "Rent Per Sqft",
  description: "Annual contracted rent per square foot of rentable floor area.",
  inputs: [
    {
      id: "annualRent",
      kind: "number",
      label: "Annual Rent",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "rentableSquareFeet",
      kind: "number",
      label: "Rentable Square Feet",
      unit: "ft2",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "annualRentPerSquareFoot",
      kind: "number",
      label: "Annual Rent Per Square Foot",
      unit: "currency/ft2",
    },
  ],
  calculate: (input) =>
    calculateRentPerSqft({
      annualRent: input.annualRent as number,
      rentableSquareFeet: input.rentableSquareFeet as number,
    }),
});
export const rentPerSqftTool = tool;
export const runRentPerSqft = tool.execute;
export default tool;
