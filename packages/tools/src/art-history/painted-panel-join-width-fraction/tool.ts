import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly joinWidths: readonly number[];
  readonly panelWidth: number;
};
export type Output = {
  readonly totalJoinWidth: number;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    joinWidths: { type: "array", maxItems: 256, items: { type: "number" } },
    panelWidth: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["joinWidths", "panelWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalJoinWidth: { type: "number" },
    fraction: { type: "number" },
  },
  required: ["totalJoinWidth", "fraction"],
} as const;
/** Calculate painted panel join width fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { joinWidths, panelWidth } = request;
  const compute = (): Output => {
    H.positive(panelWidth);
    H.domain(
      joinWidths.every((w) => w >= 0) &&
        joinWidths.reduce((a, b) => a + b, 0) <= panelWidth,
    );
    return {
      totalJoinWidth: joinWidths.reduce((a, b) => a + b, 0),
      fraction: joinWidths.reduce((a, b) => a + b, 0) / panelWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { joinWidths: [0.2, 0.3], panelWidth: 50 },
  output: { totalJoinWidth: 0.5, fraction: 0.01 },
} satisfies ToolExample<Input, Output>;
export const paintedPanelJoinWidthFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/painted-panel-join-width-fraction",
    title: "Painted Panel Join Width Fraction Tool",
    description:
      "Calculate painted panel join width fraction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        joinWidths: { type: "array", maxItems: 256, items: { type: "number" } },
        panelWidth: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["joinWidths", "panelWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalJoinWidth: { type: "number" },
        fraction: { type: "number" },
      },
      required: ["totalJoinWidth", "fraction"],
    },
    ports: {
      inputs: [
        {
          id: "joinWidths",
          label: "Join Widths",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "panelWidth",
          label: "Panel Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalJoinWidth",
          label: "Total Join Width",
          valueType: { type: "number" },
        },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = paintedPanelJoinWidthFractionTool.execute;
export default paintedPanelJoinWidthFractionTool;
