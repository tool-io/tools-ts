import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstFlux: number;
  readonly secondFlux: number;
  readonly firstDistance: number;
  readonly secondDistance: number;
};
export type Output = { readonly luminosityRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstFlux: { type: "number", minimum: 0 },
    secondFlux: { type: "number", exclusiveMinimum: 0 },
    firstDistance: { type: "number", exclusiveMinimum: 0 },
    secondDistance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstFlux", "secondFlux", "firstDistance", "secondDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { luminosityRatio: { type: "number" } },
  required: ["luminosityRatio"],
} as const;
/** Compare isotropic luminosities using supplied luminosity distances and compatible flux units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstFlux, secondFlux, firstDistance, secondDistance } = request;
  const compute = (): Output => {
    H.domain(firstFlux >= 0);
    H.positive(secondFlux);
    H.positive(firstDistance);
    H.positive(secondDistance);
    return {
      luminosityRatio:
        (firstFlux / secondFlux) * (firstDistance / secondDistance) ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstFlux: 2, secondFlux: 1, firstDistance: 3, secondDistance: 2 },
  output: { luminosityRatio: 4.5 },
} satisfies ToolExample<Input, Output>;
export const fluxLuminosityReferenceRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cosmology/flux-luminosity-reference-ratio",
    title: "Flux Luminosity Reference Ratio Tool",
    description:
      "Compare isotropic luminosities using supplied luminosity distances and compatible flux units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstFlux: { type: "number", minimum: 0 },
        secondFlux: { type: "number", exclusiveMinimum: 0 },
        firstDistance: { type: "number", exclusiveMinimum: 0 },
        secondDistance: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstFlux", "secondFlux", "firstDistance", "secondDistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { luminosityRatio: { type: "number" } },
      required: ["luminosityRatio"],
    },
    ports: {
      inputs: [
        {
          id: "firstFlux",
          label: "First Flux",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondFlux",
          label: "Second Flux",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstDistance",
          label: "First Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDistance",
          label: "Second Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "luminosityRatio",
          label: "Luminosity Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fluxLuminosityReferenceRatioTool.execute;
export default fluxLuminosityReferenceRatioTool;
