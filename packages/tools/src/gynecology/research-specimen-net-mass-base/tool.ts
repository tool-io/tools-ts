import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossMass: number;
  readonly tareMass: number;
  readonly attachedMaterial: number;
  readonly excludeAttached: boolean;
};
export type Output = {
  readonly netMass: number;
  readonly excludedMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossMass: { type: "number", minimum: 0 },
    tareMass: { type: "number", minimum: 0 },
    attachedMaterial: { type: "number", minimum: 0 },
    excludeAttached: { type: "boolean" },
  },
  required: ["grossMass", "tareMass", "attachedMaterial", "excludeAttached"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netMass: { type: "number" }, excludedMass: { type: "number" } },
  required: ["netMass", "excludedMass"],
} as const;
/** Compute specimen ledger mass under an explicit attached-material inclusion policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossMass, tareMass, attachedMaterial, excludeAttached } = request;
  const compute = (): Output => {
    H.domain(
      grossMass >= 0 &&
        tareMass >= 0 &&
        attachedMaterial >= 0 &&
        tareMass + attachedMaterial <= grossMass,
    );
    return {
      netMass: grossMass - tareMass - (excludeAttached ? attachedMaterial : 0),
      excludedMass: tareMass + (excludeAttached ? attachedMaterial : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossMass: 50,
    tareMass: 5,
    attachedMaterial: 10,
    excludeAttached: true,
  },
  output: { netMass: 35, excludedMass: 15 },
} satisfies ToolExample<Input, Output>;
export const researchSpecimenNetMassBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gynecology/research-specimen-net-mass-base",
    title: "Research Specimen Net Mass Base Tool",
    description:
      "Compute specimen ledger mass under an explicit attached-material inclusion policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossMass: { type: "number", minimum: 0 },
        tareMass: { type: "number", minimum: 0 },
        attachedMaterial: { type: "number", minimum: 0 },
        excludeAttached: { type: "boolean" },
      },
      required: [
        "grossMass",
        "tareMass",
        "attachedMaterial",
        "excludeAttached",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netMass: { type: "number" },
        excludedMass: { type: "number" },
      },
      required: ["netMass", "excludedMass"],
    },
    ports: {
      inputs: [
        {
          id: "grossMass",
          label: "Gross Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tareMass",
          label: "Tare Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "attachedMaterial",
          label: "Attached Material",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludeAttached",
          label: "Exclude Attached",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "netMass", label: "Net Mass", valueType: { type: "number" } },
        {
          id: "excludedMass",
          label: "Excluded Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchSpecimenNetMassBaseTool.execute;
export default researchSpecimenNetMassBaseTool;
