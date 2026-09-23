import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly width: number;
  readonly height: number;
  readonly elliptical: boolean;
};
export type Output = { readonly area: number; readonly aspectRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number", minimum: 0 },
    height: { type: "number", exclusiveMinimum: 0 },
    elliptical: { type: "boolean" },
  },
  required: ["width", "height", "elliptical"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { area: { type: "number" }, aspectRatio: { type: "number" } },
  required: ["area", "aspectRatio"],
} as const;
/** Calculate printed strand width height area term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { width, height, elliptical } = request;
  const compute = (): Output => {
    H.domain(width >= 0);
    H.positive(height);
    return {
      area: width * height * (elliptical ? Math.PI / 4 : 1),
      aspectRatio: width / height,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { width: 2, height: 1, elliptical: true },
  output: { area: 1.5707963267948966, aspectRatio: 2 },
} satisfies ToolExample<Input, Output>;
export const printedStrandWidthHeightAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biofabrication/printed-strand-width-height-area-term",
    title: "Printed Strand Width Height Area Term Tool",
    description:
      "Calculate printed strand width height area term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number", minimum: 0 },
        height: { type: "number", exclusiveMinimum: 0 },
        elliptical: { type: "boolean" },
      },
      required: ["width", "height", "elliptical"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { area: { type: "number" }, aspectRatio: { type: "number" } },
      required: ["area", "aspectRatio"],
    },
    ports: {
      inputs: [
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "height",
          label: "Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elliptical",
          label: "Elliptical",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "area", label: "Area", valueType: { type: "number" } },
        {
          id: "aspectRatio",
          label: "Aspect Ratio",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = printedStrandWidthHeightAreaTermTool.execute;
export default printedStrandWidthHeightAreaTermTool;
