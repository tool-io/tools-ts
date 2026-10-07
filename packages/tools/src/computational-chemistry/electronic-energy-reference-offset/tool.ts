import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly energy: number;
  readonly referenceEnergy: number;
};
export type Output = { readonly relativeEnergy: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    energy: { type: "number" },
    referenceEnergy: { type: "number" },
  },
  required: ["energy", "referenceEnergy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeEnergy: { type: "number" } },
  required: ["relativeEnergy"],
} as const;
/** Compute a signed electronic-energy offset in an explicitly shared energy unit without converting methods or reference states. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { energy, referenceEnergy } = request;
  const compute = (): Output => {
    return { relativeEnergy: energy - referenceEnergy };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { energy: -100.25, referenceEnergy: -100.5 },
  output: { relativeEnergy: 0.25 },
} satisfies ToolExample<Input, Output>;
export const electronicEnergyReferenceOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "computational-chemistry",
        "computational chemistry",
        "chemistry",
      ],
      keywords: ["computational chemistry", "chemistry"],
    },
    id: "computational-chemistry/electronic-energy-reference-offset",
    title: "Electronic Energy Reference Offset",
    description:
      "Compute a signed electronic-energy offset in an explicitly shared energy unit without converting methods or reference states.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        energy: { type: "number" },
        referenceEnergy: { type: "number" },
      },
      required: ["energy", "referenceEnergy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { relativeEnergy: { type: "number" } },
      required: ["relativeEnergy"],
    },
    ports: {
      inputs: [
        {
          id: "energy",
          label: "Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceEnergy",
          label: "Reference Energy",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativeEnergy",
          label: "Relative Energy",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = electronicEnergyReferenceOffsetTool.execute;
export default electronicEnergyReferenceOffsetTool;
