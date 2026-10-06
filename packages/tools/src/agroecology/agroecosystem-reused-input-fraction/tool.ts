import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reusedInputMass: number;
  readonly totalInputMass: number;
};
export type Output = {
  readonly reusedFraction: number;
  readonly newlySourcedMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reusedInputMass: { type: "number", minimum: 0 },
    totalInputMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["reusedInputMass", "totalInputMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reusedFraction: { type: "number" },
    newlySourcedMass: { type: "number" },
  },
  required: ["reusedFraction", "newlySourcedMass"],
} as const;
/** Describe a reused-input mass share for one explicitly bounded agroecosystem input ledger. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reusedInputMass, totalInputMass } = request;
  const compute = (): Output => {
    (H.domain(totalInputMass > 0, "totalInputMass"), totalInputMass);
    H.domain(
      reusedInputMass >= 0 && reusedInputMass <= totalInputMass,
      "reusedInputMass",
    );
    return {
      reusedFraction: reusedInputMass / totalInputMass,
      newlySourcedMass: totalInputMass - reusedInputMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reusedInputMass: 30, totalInputMass: 100 },
  output: { reusedFraction: 0.3, newlySourcedMass: 70 },
} satisfies ToolExample<Input, Output>;
export const agroecosystemReusedInputFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroecology", "agriculture"],
      keywords: ["agroecology", "agriculture"],
    },
    id: "agroecology/agroecosystem-reused-input-fraction",
    title: "Agroecosystem Reused Input Fraction",
    description:
      "Describe a reused-input mass share for one explicitly bounded agroecosystem input ledger.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reusedInputMass: { type: "number", minimum: 0 },
        totalInputMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["reusedInputMass", "totalInputMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reusedFraction: { type: "number" },
        newlySourcedMass: { type: "number" },
      },
      required: ["reusedFraction", "newlySourcedMass"],
    },
    ports: {
      inputs: [
        {
          id: "reusedInputMass",
          label: "Reused Input Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalInputMass",
          label: "Total Input Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "reusedFraction",
          label: "Reused Fraction",
          valueType: { type: "number" },
        },
        {
          id: "newlySourcedMass",
          label: "Newly Sourced Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = agroecosystemReusedInputFractionTool.execute;
export default agroecosystemReusedInputFractionTool;
