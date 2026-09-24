import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly photonsPerSecond: number;
  readonly wavelength: number;
  readonly planckConstant: number;
  readonly lightSpeed: number;
};
export type Output = { readonly watts: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    photonsPerSecond: { type: "number", minimum: 0 },
    wavelength: { type: "number", exclusiveMinimum: 0 },
    planckConstant: { type: "number", exclusiveMinimum: 0 },
    lightSpeed: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["photonsPerSecond", "wavelength", "planckConstant", "lightSpeed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { watts: { type: "number" } },
  required: ["watts"],
} as const;
/** Convert monochromatic photon rate to power using caller-supplied h and c in consistent SI units. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { photonsPerSecond, wavelength, planckConstant, lightSpeed } = input;
  const compute = (): Output => {
    H.domain(photonsPerSecond >= 0);
    H.positive(wavelength);
    H.positive(planckConstant);
    H.positive(lightSpeed);
    return {
      watts: (photonsPerSecond * planckConstant * lightSpeed) / wavelength,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    photonsPerSecond: 1e15,
    wavelength: 5e-7,
    planckConstant: 6.62607015e-34,
    lightSpeed: 299792458,
  },
  output: { watts: 0.00039728917142978573 },
} satisfies ToolExample<Input, Output>;
export const photonFluxRadiantFluxOneWavelengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "convert/photon-flux-radiant-flux-one-wavelength",
    title: "Photon Flux Radiant Flux One Wavelength Tool",
    description:
      "Convert monochromatic photon rate to power using caller-supplied h and c in consistent SI units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        photonsPerSecond: { type: "number", minimum: 0 },
        wavelength: { type: "number", exclusiveMinimum: 0 },
        planckConstant: { type: "number", exclusiveMinimum: 0 },
        lightSpeed: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "photonsPerSecond",
        "wavelength",
        "planckConstant",
        "lightSpeed",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { watts: { type: "number" } },
      required: ["watts"],
    },
    ports: {
      inputs: [
        {
          id: "photonsPerSecond",
          label: "Photons Per Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wavelength",
          label: "Wavelength",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "planckConstant",
          label: "Planck Constant",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lightSpeed",
          label: "Light Speed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "watts", label: "Watts", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = photonFluxRadiantFluxOneWavelengthTool.execute;
export default photonFluxRadiantFluxOneWavelengthTool;
