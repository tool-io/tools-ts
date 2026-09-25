import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly age: number;
  readonly cutoff: number;
  readonly belowWeight: number;
  readonly aboveWeight: number;
};
export type Output = { readonly weight: number; readonly jump: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    age: { type: "number", minimum: 0 },
    cutoff: { type: "number", minimum: 0 },
    belowWeight: { type: "number", minimum: 0 },
    aboveWeight: { type: "number", minimum: 0 },
  },
  required: ["age", "cutoff", "belowWeight", "aboveWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weight: { type: "number" }, jump: { type: "number" } },
  required: ["weight", "jump"],
} as const;
/** Explicit age-threshold weight with equality assigned to the upper band; no equivalence-scale policy is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { age, cutoff, belowWeight, aboveWeight } = request;
  const compute = (): Output => {
    H.domain(age >= 0 && cutoff >= 0 && belowWeight >= 0 && aboveWeight >= 0);
    return {
      weight: age < cutoff ? belowWeight : aboveWeight,
      jump: aboveWeight - belowWeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { age: 14, cutoff: 14, belowWeight: 0.3, aboveWeight: 0.5 },
  output: { weight: 0.5, jump: 0.2 },
} satisfies ToolExample<Input, Output>;
export const householdConsumptionAgeweightBoundaryGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "demographic-economics/household-consumption-ageweight-boundary-gap",
      title: "Household Consumption Ageweight Boundary Gap Tool",
      description:
        "Explicit age-threshold weight with equality assigned to the upper band; no equivalence-scale policy is selected.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          age: { type: "number", minimum: 0 },
          cutoff: { type: "number", minimum: 0 },
          belowWeight: { type: "number", minimum: 0 },
          aboveWeight: { type: "number", minimum: 0 },
        },
        required: ["age", "cutoff", "belowWeight", "aboveWeight"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { weight: { type: "number" }, jump: { type: "number" } },
        required: ["weight", "jump"],
      },
      ports: {
        inputs: [
          {
            id: "age",
            label: "Age",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "cutoff",
            label: "Cutoff",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "belowWeight",
            label: "Below Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "aboveWeight",
            label: "Above Weight",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "weight", label: "Weight", valueType: { type: "number" } },
          { id: "jump", label: "Jump", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = householdConsumptionAgeweightBoundaryGapTool.execute;
export default householdConsumptionAgeweightBoundaryGapTool;
