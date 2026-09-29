import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly gap: number; readonly thickness: number };
export type Output = { readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gap: { type: "number", minimum: 0 },
    thickness: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["gap", "thickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
/** Calculate section gap to thickness ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gap, thickness } = request;
  const compute = (): Output => {
    H.domain(gap >= 0);
    H.positive(thickness);
    return { ratio: gap / thickness };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { gap: 2, thickness: 5 },
  output: { ratio: 0.4 },
} satisfies ToolExample<Input, Output>;
export const sectionGapToThicknessRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/section-gap-to-thickness-ratio",
    title: "Section Gap To Thickness Ratio Tool",
    description:
      "Calculate section gap to thickness ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gap: { type: "number", minimum: 0 },
        thickness: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["gap", "thickness"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" } },
      required: ["ratio"],
    },
    ports: {
      inputs: [
        {
          id: "gap",
          label: "Gap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "thickness",
          label: "Thickness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "ratio", label: "Ratio", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = sectionGapToThicknessRatioTool.execute;
export default sectionGapToThicknessRatioTool;
