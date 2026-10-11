import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly photonFluxMicromolesPerSecond: number;
  readonly illuminatedAreaSquareMeters: number;
};
export type Output = { readonly micromolesPerSquareMeterPerSecond: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    photonFluxMicromolesPerSecond: { type: "number", minimum: 0 },
    illuminatedAreaSquareMeters: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["photonFluxMicromolesPerSecond", "illuminatedAreaSquareMeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { micromolesPerSquareMeterPerSecond: { type: "number" } },
  required: ["micromolesPerSquareMeterPerSecond"],
} as const;
/** Divide explicit photon flux by supplied illuminated area under a uniform-distribution assumption without estimating canopy interception. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { photonFluxMicromolesPerSecond, illuminatedAreaSquareMeters } =
    request;
  const compute = (): Output => {
    H.domain(
      photonFluxMicromolesPerSecond >= 0,
      "photonFluxMicromolesPerSecond",
    );
    (H.domain(illuminatedAreaSquareMeters > 0, "illuminatedAreaSquareMeters"),
      illuminatedAreaSquareMeters);
    return {
      micromolesPerSquareMeterPerSecond:
        photonFluxMicromolesPerSecond / illuminatedAreaSquareMeters,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { photonFluxMicromolesPerSecond: 600, illuminatedAreaSquareMeters: 3 },
  output: { micromolesPerSquareMeterPerSecond: 200 },
} satisfies ToolExample<Input, Output>;
export const lightingPhotonFluxPerAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["vertical-farming", "vertical farming", "agriculture"],
      keywords: ["vertical farming", "agriculture"],
    },
    id: "vertical-farming/lighting-photon-flux-per-area",
    title: "Lighting Photon Flux Per Area",
    description:
      "Divide explicit photon flux by supplied illuminated area under a uniform-distribution assumption without estimating canopy interception.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        photonFluxMicromolesPerSecond: { type: "number", minimum: 0 },
        illuminatedAreaSquareMeters: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "photonFluxMicromolesPerSecond",
        "illuminatedAreaSquareMeters",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { micromolesPerSquareMeterPerSecond: { type: "number" } },
      required: ["micromolesPerSquareMeterPerSecond"],
    },
    ports: {
      inputs: [
        {
          id: "photonFluxMicromolesPerSecond",
          label: "Photon Flux Micromoles Per Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "illuminatedAreaSquareMeters",
          label: "Illuminated Area Square Meters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "micromolesPerSquareMeterPerSecond",
          label: "Micromoles Per Square Meter Per Second",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lightingPhotonFluxPerAreaTool.execute;
export default lightingPhotonFluxPerAreaTool;
