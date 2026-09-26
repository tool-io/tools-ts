import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly landedMass: number;
  readonly pricePerMass: number;
  readonly variableCost: number;
  readonly laborOpportunityCost: number;
  readonly capitalOpportunityCost: number;
};
export type Output = {
  readonly revenue: number;
  readonly resourceRent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    landedMass: { type: "number", minimum: 0 },
    pricePerMass: { type: "number" },
    variableCost: { type: "number", minimum: 0 },
    laborOpportunityCost: { type: "number", minimum: 0 },
    capitalOpportunityCost: { type: "number", minimum: 0 },
  },
  required: [
    "landedMass",
    "pricePerMass",
    "variableCost",
    "laborOpportunityCost",
    "capitalOpportunityCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { revenue: { type: "number" }, resourceRent: { type: "number" } },
  required: ["revenue", "resourceRent"],
} as const;
/** Calculate fisheries resource rent one landing term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    landedMass,
    pricePerMass,
    variableCost,
    laborOpportunityCost,
    capitalOpportunityCost,
  } = request;
  const compute = (): Output => {
    H.domain(
      landedMass >= 0 &&
        variableCost >= 0 &&
        laborOpportunityCost >= 0 &&
        capitalOpportunityCost >= 0,
    );
    return {
      revenue: landedMass * pricePerMass,
      resourceRent:
        landedMass * pricePerMass -
        variableCost -
        laborOpportunityCost -
        capitalOpportunityCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    landedMass: 1000,
    pricePerMass: 3,
    variableCost: 1000,
    laborOpportunityCost: 500,
    capitalOpportunityCost: 400,
  },
  output: { revenue: 3000, resourceRent: 1100 },
} satisfies ToolExample<Input, Output>;
export const fisheriesResourceRentOneLandingTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-economics/fisheries-resource-rent-one-landing-term",
      title: "Fisheries Resource Rent One Landing Term Tool",
      description:
        "Calculate fisheries resource rent one landing term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          landedMass: { type: "number", minimum: 0 },
          pricePerMass: { type: "number" },
          variableCost: { type: "number", minimum: 0 },
          laborOpportunityCost: { type: "number", minimum: 0 },
          capitalOpportunityCost: { type: "number", minimum: 0 },
        },
        required: [
          "landedMass",
          "pricePerMass",
          "variableCost",
          "laborOpportunityCost",
          "capitalOpportunityCost",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          revenue: { type: "number" },
          resourceRent: { type: "number" },
        },
        required: ["revenue", "resourceRent"],
      },
      ports: {
        inputs: [
          {
            id: "landedMass",
            label: "Landed Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "pricePerMass",
            label: "Price Per Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "variableCost",
            label: "Variable Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "laborOpportunityCost",
            label: "Labor Opportunity Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "capitalOpportunityCost",
            label: "Capital Opportunity Cost",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "revenue", label: "Revenue", valueType: { type: "number" } },
          {
            id: "resourceRent",
            label: "Resource Rent",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = fisheriesResourceRentOneLandingTermTool.execute;
export default fisheriesResourceRentOneLandingTermTool;
