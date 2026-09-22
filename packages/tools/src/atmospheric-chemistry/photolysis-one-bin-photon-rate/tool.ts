import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly photonFluxDensity: number;
  readonly binWidth: number;
  readonly crossSection: number;
  readonly quantumYield: number;
};
export type Output = { readonly rateContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    photonFluxDensity: { type: "number", minimum: 0 },
    binWidth: { type: "number", minimum: 0 },
    crossSection: { type: "number", minimum: 0 },
    quantumYield: { type: "number", minimum: 0 },
  },
  required: ["photonFluxDensity", "binWidth", "crossSection", "quantumYield"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rateContribution: { type: "number" } },
  required: ["rateContribution"],
} as const;
/** One wavelength-bin contribution using photon rather than energy flux and a caller-supplied quantum yield. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { photonFluxDensity, binWidth, crossSection, quantumYield } = request;
  const compute = (): Output => {
    H.domain(
      photonFluxDensity >= 0 &&
        binWidth >= 0 &&
        crossSection >= 0 &&
        quantumYield >= 0,
    );
    return {
      rateContribution:
        photonFluxDensity * binWidth * crossSection * quantumYield,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    photonFluxDensity: 10,
    binWidth: 2,
    crossSection: 0.1,
    quantumYield: 0.5,
  },
  output: { rateContribution: 1 },
} satisfies ToolExample<Input, Output>;
export const photolysisOneBinPhotonRateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-chemistry/photolysis-one-bin-photon-rate",
    title: "Photolysis One Bin Photon Rate Tool",
    description:
      "One wavelength-bin contribution using photon rather than energy flux and a caller-supplied quantum yield.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        photonFluxDensity: { type: "number", minimum: 0 },
        binWidth: { type: "number", minimum: 0 },
        crossSection: { type: "number", minimum: 0 },
        quantumYield: { type: "number", minimum: 0 },
      },
      required: [
        "photonFluxDensity",
        "binWidth",
        "crossSection",
        "quantumYield",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rateContribution: { type: "number" } },
      required: ["rateContribution"],
    },
    ports: {
      inputs: [
        {
          id: "photonFluxDensity",
          label: "Photon Flux Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "binWidth",
          label: "Bin Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "crossSection",
          label: "Cross Section",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantumYield",
          label: "Quantum Yield",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rateContribution",
          label: "Rate Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = photolysisOneBinPhotonRateTool.execute;
export default photolysisOneBinPhotonRateTool;
