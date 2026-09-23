import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly removedSampleMass: number;
  readonly suppliedConcentration: number;
  readonly concentrationUnitFactor: number;
};
export type Output = { readonly removedQuantity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    removedSampleMass: { type: "number", minimum: 0 },
    suppliedConcentration: { type: "number" },
    concentrationUnitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "removedSampleMass",
    "suppliedConcentration",
    "concentrationUnitFactor",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { removedQuantity: { type: "number" } },
  required: ["removedQuantity"],
} as const;
/** Convert supplied removed sample mass and signed blank-corrected concentration to an explicit mass ledger contribution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { removedSampleMass, suppliedConcentration, concentrationUnitFactor } =
    request;
  const compute = (): Output => {
    H.domain(removedSampleMass >= 0);
    H.positive(concentrationUnitFactor);
    return {
      removedQuantity:
        removedSampleMass * suppliedConcentration * concentrationUnitFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    removedSampleMass: 10,
    suppliedConcentration: 2,
    concentrationUnitFactor: 0.5,
  },
  output: { removedQuantity: 10 },
} satisfies ToolExample<Input, Output>;
export const sampleRemovalMassContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioremediation/sample-removal-mass-contribution",
    title: "Sample Removal Mass Contribution Tool",
    description:
      "Convert supplied removed sample mass and signed blank-corrected concentration to an explicit mass ledger contribution.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        removedSampleMass: { type: "number", minimum: 0 },
        suppliedConcentration: { type: "number" },
        concentrationUnitFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "removedSampleMass",
        "suppliedConcentration",
        "concentrationUnitFactor",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { removedQuantity: { type: "number" } },
      required: ["removedQuantity"],
    },
    ports: {
      inputs: [
        {
          id: "removedSampleMass",
          label: "Removed Sample Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedConcentration",
          label: "Supplied Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "concentrationUnitFactor",
          label: "Concentration Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "removedQuantity",
          label: "Removed Quantity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sampleRemovalMassContributionTool.execute;
export default sampleRemovalMassContributionTool;
