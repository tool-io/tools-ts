import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly projectionMillimeters: number };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { projectionMillimeters: { type: "number" } },
  required: ["projectionMillimeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a measured stair-nosing projection in millimeters without assigning building-code compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { projectionMillimeters } = request;
  const compute = (): Output => {
    H.domain(projectionMillimeters >= 0, "projectionMillimeters");
    return { label: "Nosing projection: " + projectionMillimeters + " mm" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { projectionMillimeters: 25 },
  output: { label: "Nosing projection: 25 mm" },
} satisfies ToolExample<Input, Output>;
export const stairNosingProjectionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/stair-nosing-projection-label",
    title: "Stair Nosing Projection Label Tool",
    description:
      "Label a measured stair-nosing projection in millimeters without assigning building-code compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { projectionMillimeters: { type: "number" } },
      required: ["projectionMillimeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "projectionMillimeters",
          label: "Projection Millimeters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = stairNosingProjectionLabelTool.execute;
export default stairNosingProjectionLabelTool;
