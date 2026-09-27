import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dimensions: readonly number[];
  readonly unit: string;
};
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dimensions: { type: "array", maxItems: 256, items: { type: "number" } },
    unit: { type: "string", maxLength: 8192 },
  },
  required: ["dimensions", "unit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Calculate dimension triple unit once style from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dimensions, unit } = request;
  const compute = (): Output => {
    H.domain(
      dimensions.length === 3 &&
        dimensions.every((x) => x >= 0) &&
        unit.length > 0,
    );
    return { text: dimensions.join(" × ") + " " + unit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dimensions: [2, 3, 4], unit: "cm" },
  output: { text: "2 × 3 × 4 cm" },
} satisfies ToolExample<Input, Output>;
export const dimensionTripleUnitOnceStyleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/dimension-triple-unit-once-style",
    title: "Dimension Triple Unit Once Style Tool",
    description:
      "Calculate dimension triple unit once style from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dimensions: { type: "array", maxItems: 256, items: { type: "number" } },
        unit: { type: "string", maxLength: 8192 },
      },
      required: ["dimensions", "unit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    ports: {
      inputs: [
        {
          id: "dimensions",
          label: "Dimensions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "unit",
          label: "Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = dimensionTripleUnitOnceStyleTool.execute;
export default dimensionTripleUnitOnceStyleTool;
