import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly buttonTopLevel: number;
  readonly enclosureFaceLevel: number;
};
export type Output = { readonly protrusion: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    buttonTopLevel: { type: "number" },
    enclosureFaceLevel: { type: "number" },
  },
  required: ["buttonTopLevel", "enclosureFaceLevel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { protrusion: { type: "number" } },
  required: ["protrusion"],
} as const;
/** Record signed button protrusion above the enclosure face on one shared elevation axis; negative means recessed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { buttonTopLevel, enclosureFaceLevel } = request;
  const compute = (): Output => {
    return { protrusion: buttonTopLevel - enclosureFaceLevel };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { buttonTopLevel: 4.5, enclosureFaceLevel: 3 },
  output: { protrusion: 1.5 },
} satisfies ToolExample<Input, Output>;
export const productButtonProtrusionHeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/product-button-protrusion-height",
    title: "Product Button Protrusion Height Tool",
    description:
      "Record signed button protrusion above the enclosure face on one shared elevation axis; negative means recessed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        buttonTopLevel: { type: "number" },
        enclosureFaceLevel: { type: "number" },
      },
      required: ["buttonTopLevel", "enclosureFaceLevel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { protrusion: { type: "number" } },
      required: ["protrusion"],
    },
    ports: {
      inputs: [
        {
          id: "buttonTopLevel",
          label: "Button Top Level",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "enclosureFaceLevel",
          label: "Enclosure Face Level",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "protrusion",
          label: "Protrusion",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = productButtonProtrusionHeightTool.execute;
export default productButtonProtrusionHeightTool;
