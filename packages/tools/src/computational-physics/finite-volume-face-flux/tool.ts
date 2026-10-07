import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fluxDensity: number;
  readonly faceArea: number;
  readonly outwardSign: number;
};
export type Output = { readonly outwardIntegratedFlux: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fluxDensity: { type: "number" },
    faceArea: { type: "number", minimum: 0 },
    outwardSign: { type: "integer" },
  },
  required: ["fluxDensity", "faceArea", "outwardSign"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { outwardIntegratedFlux: { type: "number" } },
  required: ["outwardIntegratedFlux"],
} as const;
/** Integrate an explicit constant face-normal flux density over a face area using a supplied outward sign. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fluxDensity, faceArea, outwardSign } = request;
  const compute = (): Output => {
    H.domain(faceArea >= 0, "faceArea");
    H.domain(outwardSign === 1 || outwardSign === -1, "outwardSign");
    return { outwardIntegratedFlux: fluxDensity * faceArea * outwardSign };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fluxDensity: 2, faceArea: 3, outwardSign: -1 },
  output: { outwardIntegratedFlux: -6 },
} satisfies ToolExample<Input, Output>;
export const finiteVolumeFaceFluxTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["computational-physics", "computational physics", "physics"],
      keywords: ["computational physics", "physics"],
    },
    id: "computational-physics/finite-volume-face-flux",
    title: "Finite Volume Face Flux",
    description:
      "Integrate an explicit constant face-normal flux density over a face area using a supplied outward sign.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fluxDensity: { type: "number" },
        faceArea: { type: "number", minimum: 0 },
        outwardSign: { type: "integer" },
      },
      required: ["fluxDensity", "faceArea", "outwardSign"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { outwardIntegratedFlux: { type: "number" } },
      required: ["outwardIntegratedFlux"],
    },
    ports: {
      inputs: [
        {
          id: "fluxDensity",
          label: "Flux Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "faceArea",
          label: "Face Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outwardSign",
          label: "Outward Sign",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "outwardIntegratedFlux",
          label: "Outward Integrated Flux",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = finiteVolumeFaceFluxTool.execute;
export default finiteVolumeFaceFluxTool;
