import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dryMassGrams: number;
  readonly trapAreaSquareMeters: number;
  readonly deploymentDays: number;
};
export type Output = { readonly gramsPerSquareMeterDay: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryMassGrams: { type: "number", minimum: 0 },
    trapAreaSquareMeters: { type: "number", exclusiveMinimum: 0 },
    deploymentDays: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["dryMassGrams", "trapAreaSquareMeters", "deploymentDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gramsPerSquareMeterDay: { type: "number" } },
  required: ["gramsPerSquareMeterDay"],
} as const;
/** Normalize measured sediment-trap dry mass by positive collector area and deployment duration without correcting collection efficiency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dryMassGrams, trapAreaSquareMeters, deploymentDays } = request;
  const compute = (): Output => {
    H.domain(dryMassGrams >= 0, "dryMassGrams");
    (H.domain(trapAreaSquareMeters > 0, "trapAreaSquareMeters"),
      trapAreaSquareMeters);
    (H.domain(deploymentDays > 0, "deploymentDays"), deploymentDays);
    return {
      gramsPerSquareMeterDay:
        dryMassGrams / trapAreaSquareMeters / deploymentDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dryMassGrams: 12, trapAreaSquareMeters: 0.2, deploymentDays: 10 },
  output: { gramsPerSquareMeterDay: 6 },
} satisfies ToolExample<Input, Output>;
export const sedimentTrapDryMassFluxTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "aquatic-science",
        "aquatic science",
        "earth and environmental sciences",
      ],
      keywords: ["aquatic science", "earth and environmental sciences"],
    },
    id: "aquatic-science/sediment-trap-dry-mass-flux",
    title: "Sediment Trap Dry Mass Flux",
    description:
      "Normalize measured sediment-trap dry mass by positive collector area and deployment duration without correcting collection efficiency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryMassGrams: { type: "number", minimum: 0 },
        trapAreaSquareMeters: { type: "number", exclusiveMinimum: 0 },
        deploymentDays: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["dryMassGrams", "trapAreaSquareMeters", "deploymentDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gramsPerSquareMeterDay: { type: "number" } },
      required: ["gramsPerSquareMeterDay"],
    },
    ports: {
      inputs: [
        {
          id: "dryMassGrams",
          label: "Dry Mass Grams",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "trapAreaSquareMeters",
          label: "Trap Area Square Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deploymentDays",
          label: "Deployment Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "gramsPerSquareMeterDay",
          label: "Grams Per Square Meter Day",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sedimentTrapDryMassFluxTool.execute;
export default sedimentTrapDryMassFluxTool;
