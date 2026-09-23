import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parentMass: number;
  readonly metaboliteMass: number;
  readonly parentMolarMass: number;
  readonly metaboliteMolarMass: number;
};
export type Output = {
  readonly parentMoles: number;
  readonly metaboliteMoles: number;
  readonly metaboliteParentRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentMass: { type: "number", exclusiveMinimum: 0 },
    metaboliteMass: { type: "number", minimum: 0 },
    parentMolarMass: { type: "number", exclusiveMinimum: 0 },
    metaboliteMolarMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "parentMass",
    "metaboliteMass",
    "parentMolarMass",
    "metaboliteMolarMass",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentMoles: { type: "number" },
    metaboliteMoles: { type: "number" },
    metaboliteParentRatio: { type: "number" },
  },
  required: ["parentMoles", "metaboliteMoles", "metaboliteParentRatio"],
} as const;
/** Convert supplied parent/metabolite masses to molar quantities without metabolic inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parentMass, metaboliteMass, parentMolarMass, metaboliteMolarMass } =
    request;
  const compute = (): Output => {
    H.positive(parentMass);
    H.domain(metaboliteMass >= 0);
    H.positive(parentMolarMass);
    H.positive(metaboliteMolarMass);
    return {
      parentMoles: parentMass / parentMolarMass,
      metaboliteMoles: metaboliteMass / metaboliteMolarMass,
      metaboliteParentRatio:
        (metaboliteMass * parentMolarMass) / (metaboliteMolarMass * parentMass),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    parentMass: 10,
    metaboliteMass: 5,
    parentMolarMass: 200,
    metaboliteMolarMass: 100,
  },
  output: {
    parentMoles: 0.05,
    metaboliteMoles: 0.05,
    metaboliteParentRatio: 1,
  },
} satisfies ToolExample<Input, Output>;
export const biomonitoringParentMetaboliteMolarFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biomonitoring/biomonitoring-parent-metabolite-molar-factor",
      title: "Biomonitoring Parent Metabolite Molar Factor Tool",
      description:
        "Convert supplied parent/metabolite masses to molar quantities without metabolic inference.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          parentMass: { type: "number", exclusiveMinimum: 0 },
          metaboliteMass: { type: "number", minimum: 0 },
          parentMolarMass: { type: "number", exclusiveMinimum: 0 },
          metaboliteMolarMass: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "parentMass",
          "metaboliteMass",
          "parentMolarMass",
          "metaboliteMolarMass",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          parentMoles: { type: "number" },
          metaboliteMoles: { type: "number" },
          metaboliteParentRatio: { type: "number" },
        },
        required: ["parentMoles", "metaboliteMoles", "metaboliteParentRatio"],
      },
      ports: {
        inputs: [
          {
            id: "parentMass",
            label: "Parent Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "metaboliteMass",
            label: "Metabolite Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "parentMolarMass",
            label: "Parent Molar Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "metaboliteMolarMass",
            label: "Metabolite Molar Mass",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "parentMoles",
            label: "Parent Moles",
            valueType: { type: "number" },
          },
          {
            id: "metaboliteMoles",
            label: "Metabolite Moles",
            valueType: { type: "number" },
          },
          {
            id: "metaboliteParentRatio",
            label: "Metabolite Parent Ratio",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biomonitoringParentMetaboliteMolarFactorTool.execute;
export default biomonitoringParentMetaboliteMolarFactorTool;
