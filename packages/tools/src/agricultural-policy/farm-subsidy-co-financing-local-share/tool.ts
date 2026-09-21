import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligibleCost: number;
  readonly grantFraction: number;
  readonly nationalFraction: number;
};
export type Output = {
  readonly grant: number;
  readonly national: number;
  readonly local: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleCost: { type: "number", minimum: 0 },
    grantFraction: { type: "number", minimum: 0, maximum: 1 },
    nationalFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["eligibleCost", "grantFraction", "nationalFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grant: { type: "number" },
    national: { type: "number" },
    local: { type: "number" },
  },
  required: ["grant", "national", "local"],
} as const;
/** Calculate farm subsidy co financing local share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligibleCost, grantFraction, nationalFraction } = request;
  const compute = (): Output => {
    H.domain(eligibleCost >= 0);
    H.probability(grantFraction);
    H.probability(nationalFraction);
    H.domain(grantFraction + nationalFraction <= 1);
    return {
      grant: eligibleCost * grantFraction,
      national: eligibleCost * nationalFraction,
      local: eligibleCost * (1 - grantFraction - nationalFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eligibleCost: 1000, grantFraction: 0.5, nationalFraction: 0.25 },
  output: { grant: 500, national: 250, local: 250 },
} satisfies ToolExample<Input, Output>;
export const farmSubsidyCoFinancingLocalShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-policy/farm-subsidy-co-financing-local-share",
    title: "Farm Subsidy Co Financing Local Share Tool",
    description:
      "Calculate farm subsidy co financing local share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleCost: { type: "number", minimum: 0 },
        grantFraction: { type: "number", minimum: 0, maximum: 1 },
        nationalFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["eligibleCost", "grantFraction", "nationalFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grant: { type: "number" },
        national: { type: "number" },
        local: { type: "number" },
      },
      required: ["grant", "national", "local"],
    },
    ports: {
      inputs: [
        {
          id: "eligibleCost",
          label: "Eligible Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "grantFraction",
          label: "Grant Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "nationalFraction",
          label: "National Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        { id: "grant", label: "Grant", valueType: { type: "number" } },
        { id: "national", label: "National", valueType: { type: "number" } },
        { id: "local", label: "Local", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmSubsidyCoFinancingLocalShareTool.execute;
export default farmSubsidyCoFinancingLocalShareTool;
