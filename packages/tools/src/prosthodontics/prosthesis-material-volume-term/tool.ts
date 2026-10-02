import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly mass: number; readonly density: number };
export type Output = { readonly volume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mass: { type: "number", minimum: 0 },
    density: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["mass", "density"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volume: { type: "number" } },
  required: ["volume"],
} as const;
/** Convert a supplied research material mass using explicit density without material selection advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mass, density } = request;
  const compute = (): Output => {
    H.domain(mass >= 0);
    H.positive(density);
    return { volume: mass / density };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mass: 12, density: 3 },
  output: { volume: 4 },
} satisfies ToolExample<Input, Output>;
export const prosthesisMaterialVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "prosthodontics/prosthesis-material-volume-term",
    title: "Prosthesis Material Volume Term Tool",
    description:
      "Convert a supplied research material mass using explicit density without material selection advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mass: { type: "number", minimum: 0 },
        density: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["mass", "density"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { volume: { type: "number" } },
      required: ["volume"],
    },
    ports: {
      inputs: [
        {
          id: "mass",
          label: "Mass",
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
        { id: "volume", label: "Volume", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = prosthesisMaterialVolumeTermTool.execute;
export default prosthesisMaterialVolumeTermTool;
