import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStress: number;
  readonly secondStress: number;
  readonly firstStrain: number;
  readonly secondStrain: number;
};
export type Output = { readonly modulus: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStress: { type: "number" },
    secondStress: { type: "number" },
    firstStrain: { type: "number" },
    secondStrain: { type: "number" },
  },
  required: ["firstStress", "secondStress", "firstStrain", "secondStrain"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { modulus: { type: "number" } },
  required: ["modulus"],
} as const;
/** Secant stress/strain slope on a caller-selected signed strain convention, without assuming a linear constitutive range. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStress, secondStress, firstStrain, secondStrain } = request;
  const compute = (): Output => {
    H.domain(secondStrain !== firstStrain);
    return {
      modulus: (secondStress - firstStress) / (secondStrain - firstStrain),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstStress: 10,
    secondStress: 30,
    firstStrain: 0.1,
    secondStrain: 0.2,
  },
  output: { modulus: 200 },
} satisfies ToolExample<Input, Output>;
export const hydrogelCompressionModulusOneSlopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/hydrogel-compression-modulus-one-slope",
    title: "Hydrogel Compression Modulus One Slope Tool",
    description:
      "Secant stress/strain slope on a caller-selected signed strain convention, without assuming a linear constitutive range.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstStress: { type: "number" },
        secondStress: { type: "number" },
        firstStrain: { type: "number" },
        secondStrain: { type: "number" },
      },
      required: ["firstStress", "secondStress", "firstStrain", "secondStrain"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { modulus: { type: "number" } },
      required: ["modulus"],
    },
    ports: {
      inputs: [
        {
          id: "firstStress",
          label: "First Stress",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondStress",
          label: "Second Stress",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstStrain",
          label: "First Strain",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondStrain",
          label: "Second Strain",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "modulus", label: "Modulus", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = hydrogelCompressionModulusOneSlopeTool.execute;
export default hydrogelCompressionModulusOneSlopeTool;
