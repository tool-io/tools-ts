import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly bulkVolume: number; readonly porosity: number };
export type Output = {
  readonly poreVolume: number;
  readonly solidVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bulkVolume: { type: "number", minimum: 0 },
    porosity: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["bulkVolume", "porosity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    poreVolume: { type: "number" },
    solidVolume: { type: "number" },
  },
  required: ["poreVolume", "solidVolume"],
} as const;
/** Split an explicitly supplied electrode bulk volume into pore and solid volumes using a supplied porosity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bulkVolume, porosity } = request;
  const compute = (): Output => {
    H.domain(bulkVolume >= 0, "bulkVolume");
    (H.domain(porosity >= 0 && porosity <= 1, "porosity"), porosity);
    return {
      poreVolume: bulkVolume * porosity,
      solidVolume: bulkVolume * (1 - porosity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bulkVolume: 100, porosity: 0.25 },
  output: { poreVolume: 25, solidVolume: 75 },
} satisfies ToolExample<Input, Output>;
export const electrodePorositySolidVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electrochemistry/electrode-porosity-solid-volume-term",
    title: "Electrode Porosity Solid Volume Term Tool",
    description:
      "Split an explicitly supplied electrode bulk volume into pore and solid volumes using a supplied porosity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bulkVolume: { type: "number", minimum: 0 },
        porosity: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["bulkVolume", "porosity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        poreVolume: { type: "number" },
        solidVolume: { type: "number" },
      },
      required: ["poreVolume", "solidVolume"],
    },
    ports: {
      inputs: [
        {
          id: "bulkVolume",
          label: "Bulk Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "porosity",
          label: "Porosity",
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
        {
          id: "solidVolume",
          label: "Solid Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = electrodePorositySolidVolumeTermTool.execute;
export default electrodePorositySolidVolumeTermTool;
