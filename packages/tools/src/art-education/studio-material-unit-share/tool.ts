import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly used: number; readonly supplied: number };
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    used: { type: "number", minimum: 0 },
    supplied: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["used", "supplied"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate studio material unit share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { used, supplied } = request;
  const compute = (): Output => {
    H.domain(used >= 0);
    H.positive(supplied);
    return { share: used / supplied };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { used: 3, supplied: 12 },
  output: { share: 0.25 },
} satisfies ToolExample<Input, Output>;
export const studioMaterialUnitShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-education/studio-material-unit-share",
    title: "Studio Material Unit Share Tool",
    description:
      "Calculate studio material unit share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        used: { type: "number", minimum: 0 },
        supplied: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["used", "supplied"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" } },
      required: ["share"],
    },
    ports: {
      inputs: [
        {
          id: "used",
          label: "Used",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "supplied",
          label: "Supplied",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = studioMaterialUnitShareTool.execute;
export default studioMaterialUnitShareTool;
