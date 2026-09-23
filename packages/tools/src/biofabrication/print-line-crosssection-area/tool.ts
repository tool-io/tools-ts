import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly width: number;
  readonly height: number;
  readonly elliptical: boolean;
};
export type Output = { readonly area: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number", minimum: 0 },
    height: { type: "number", minimum: 0 },
    elliptical: { type: "boolean" },
  },
  required: ["width", "height", "elliptical"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { area: { type: "number" } },
  required: ["area"],
} as const;
/** Compute a supplied ideal rectangular or elliptical print-line cross-section without a biological fabrication protocol. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { width, height, elliptical } = request;
  const compute = (): Output => {
    H.domain(width >= 0 && height >= 0);
    return { area: width * height * (elliptical ? Math.PI / 4 : 1) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { width: 4, height: 2, elliptical: true },
  output: { area: 6.283185307179586 },
} satisfies ToolExample<Input, Output>;
export const printLineCrosssectionAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biofabrication/print-line-crosssection-area",
    title: "Print Line Crosssection Area Tool",
    description:
      "Compute a supplied ideal rectangular or elliptical print-line cross-section without a biological fabrication protocol.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number", minimum: 0 },
        height: { type: "number", minimum: 0 },
        elliptical: { type: "boolean" },
      },
      required: ["width", "height", "elliptical"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { area: { type: "number" } },
      required: ["area"],
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
      outputs: [{ id: "area", label: "Area", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = printLineCrosssectionAreaTool.execute;
export default printLineCrosssectionAreaTool;
