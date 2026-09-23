import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly envelopeVolume: number;
  readonly solidVolume: number;
};
export type Output = { readonly poreVolume: number; readonly porosity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    envelopeVolume: { type: "number", exclusiveMinimum: 0 },
    solidVolume: { type: "number", minimum: 0 },
  },
  required: ["envelopeVolume", "solidVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { poreVolume: { type: "number" }, porosity: { type: "number" } },
  required: ["poreVolume", "porosity"],
} as const;
/** Calculate construct porosity volume term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { envelopeVolume, solidVolume } = request;
  const compute = (): Output => {
    H.positive(envelopeVolume);
    H.domain(solidVolume >= 0 && solidVolume <= envelopeVolume);
    return {
      poreVolume: envelopeVolume - solidVolume,
      porosity: (envelopeVolume - solidVolume) / envelopeVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { envelopeVolume: 10, solidVolume: 2 },
  output: { poreVolume: 8, porosity: 0.8 },
} satisfies ToolExample<Input, Output>;
export const constructPorosityVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biofabrication/construct-porosity-volume-term",
    title: "Construct Porosity Volume Term Tool",
    description:
      "Calculate construct porosity volume term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        envelopeVolume: { type: "number", exclusiveMinimum: 0 },
        solidVolume: { type: "number", minimum: 0 },
      },
      required: ["envelopeVolume", "solidVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        poreVolume: { type: "number" },
        porosity: { type: "number" },
      },
      required: ["poreVolume", "porosity"],
    },
    ports: {
      inputs: [
        {
          id: "envelopeVolume",
          label: "Envelope Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "solidVolume",
          label: "Solid Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "poreVolume",
          label: "Pore Volume",
          valueType: { type: "number" },
        },
        { id: "porosity", label: "Porosity", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = constructPorosityVolumeTermTool.execute;
export default constructPorosityVolumeTermTool;
