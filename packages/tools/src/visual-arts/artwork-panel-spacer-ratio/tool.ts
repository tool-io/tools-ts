import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly spacer: number; readonly panelWidth: number };
export type Output = { readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spacer: { type: "number", minimum: 0 },
    panelWidth: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["spacer", "panelWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
/** Calculate artwork panel spacer ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { spacer, panelWidth } = request;
  const compute = (): Output => {
    H.domain(spacer >= 0);
    H.positive(panelWidth);
    return { ratio: spacer / panelWidth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { spacer: 2, panelWidth: 40 },
  output: { ratio: 0.05 },
} satisfies ToolExample<Input, Output>;
export const artworkPanelSpacerRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/artwork-panel-spacer-ratio",
    title: "Artwork Panel Spacer Ratio Tool",
    description:
      "Calculate artwork panel spacer ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spacer: { type: "number", minimum: 0 },
        panelWidth: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["spacer", "panelWidth"],
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
          id: "spacer",
          label: "Spacer",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "panelWidth",
          label: "Panel Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "ratio", label: "Ratio", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = artworkPanelSpacerRatioTool.execute;
export default artworkPanelSpacerRatioTool;
