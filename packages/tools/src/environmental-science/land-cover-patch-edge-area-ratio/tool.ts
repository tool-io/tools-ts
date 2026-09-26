import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly perimeter: number; readonly area: number };
export type Output = { readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    perimeter: { type: "number", minimum: 0 },
    area: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["perimeter", "area"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
/** Calculate land cover patch edge area ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { perimeter, area } = request;
  const compute = (): Output => {
    H.domain(perimeter >= 0);
    H.positive(area);
    return { ratio: perimeter / area };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { perimeter: 40, area: 100 },
  output: { ratio: 0.4 },
} satisfies ToolExample<Input, Output>;
export const landCoverPatchEdgeAreaRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/land-cover-patch-edge-area-ratio",
    title: "Land Cover Patch Edge Area Ratio Tool",
    description:
      "Calculate land cover patch edge area ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        perimeter: { type: "number", minimum: 0 },
        area: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["perimeter", "area"],
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
          id: "perimeter",
          label: "Perimeter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "ratio", label: "Ratio", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = landCoverPatchEdgeAreaRatioTool.execute;
export default landCoverPatchEdgeAreaRatioTool;
