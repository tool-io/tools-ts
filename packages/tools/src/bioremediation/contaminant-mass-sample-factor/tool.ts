import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentration: number;
  readonly sampleMass: number;
  readonly unitFactor: number;
};
export type Output = { readonly contaminantMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentration: { type: "number", minimum: 0 },
    sampleMass: { type: "number", minimum: 0 },
    unitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["concentration", "sampleMass", "unitFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contaminantMass: { type: "number" } },
  required: ["contaminantMass"],
} as const;
/** Compute an explicit compatible sample mass contribution without organism selection or remediation instructions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentration, sampleMass, unitFactor } = request;
  const compute = (): Output => {
    H.domain(concentration >= 0 && sampleMass >= 0);
    H.positive(unitFactor);
    return { contaminantMass: concentration * sampleMass * unitFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { concentration: 2, sampleMass: 3, unitFactor: 0.001 },
  output: { contaminantMass: 0.006 },
} satisfies ToolExample<Input, Output>;
export const contaminantMassSampleFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioremediation/contaminant-mass-sample-factor",
    title: "Contaminant Mass Sample Factor Tool",
    description:
      "Compute an explicit compatible sample mass contribution without organism selection or remediation instructions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concentration: { type: "number", minimum: 0 },
        sampleMass: { type: "number", minimum: 0 },
        unitFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["concentration", "sampleMass", "unitFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contaminantMass: { type: "number" } },
      required: ["contaminantMass"],
    },
    ports: {
      inputs: [
        {
          id: "concentration",
          label: "Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleMass",
          label: "Sample Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitFactor",
          label: "Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contaminantMass",
          label: "Contaminant Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = contaminantMassSampleFactorTool.execute;
export default contaminantMassSampleFactorTool;
