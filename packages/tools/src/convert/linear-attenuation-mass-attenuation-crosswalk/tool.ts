import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly linear: number; readonly density: number };
export type Output = { readonly massAttenuation: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    linear: { type: "number", minimum: 0 },
    density: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["linear", "density"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { massAttenuation: { type: "number" } },
  required: ["massAttenuation"],
} as const;
/** Convert inverse-metre attenuation to square metres per kilogram with density in kilograms per cubic metre. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { linear, density } = input;
  const compute = (): Output => {
    H.domain(linear >= 0);
    H.positive(density);
    return { massAttenuation: linear / density };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { linear: 6, density: 3 },
  output: { massAttenuation: 2 },
} satisfies ToolExample<Input, Output>;
export const linearAttenuationMassAttenuationCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/linear-attenuation-mass-attenuation-crosswalk",
      title: "Linear Attenuation Mass Attenuation Crosswalk Tool",
      description:
        "Convert inverse-metre attenuation to square metres per kilogram with density in kilograms per cubic metre.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          linear: { type: "number", minimum: 0 },
          density: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["linear", "density"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { massAttenuation: { type: "number" } },
        required: ["massAttenuation"],
      },
      ports: {
        inputs: [
          {
            id: "linear",
            label: "Linear",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "density",
            label: "Density",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "massAttenuation",
            label: "Mass Attenuation",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = linearAttenuationMassAttenuationCrosswalkTool.execute;
export default linearAttenuationMassAttenuationCrosswalkTool;
