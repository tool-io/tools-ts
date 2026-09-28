import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly groundMetres: number;
  readonly scaleDenominator: number;
};
export type Output = { readonly paperMillimetres: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    groundMetres: { type: "number", minimum: 0 },
    scaleDenominator: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["groundMetres", "scaleDenominator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { paperMillimetres: { type: "number" } },
  required: ["paperMillimetres"],
} as const;
/** Calculate map scale bar paper length from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { groundMetres, scaleDenominator } = request;
  const compute = (): Output => {
    H.domain(groundMetres >= 0);
    H.positive(scaleDenominator);
    return { paperMillimetres: (1000 * groundMetres) / scaleDenominator };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { groundMetres: 1000, scaleDenominator: 25000 },
  output: { paperMillimetres: 40 },
} satisfies ToolExample<Input, Output>;
export const mapScaleBarPaperLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/map-scale-bar-paper-length",
    title: "Map Scale Bar Paper Length Tool",
    description:
      "Calculate map scale bar paper length from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        groundMetres: { type: "number", minimum: 0 },
        scaleDenominator: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["groundMetres", "scaleDenominator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { paperMillimetres: { type: "number" } },
      required: ["paperMillimetres"],
    },
    ports: {
      inputs: [
        {
          id: "groundMetres",
          label: "Ground Metres",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scaleDenominator",
          label: "Scale Denominator",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "paperMillimetres",
          label: "Paper Millimetres",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mapScaleBarPaperLengthTool.execute;
export default mapScaleBarPaperLengthTool;
