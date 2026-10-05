import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly panelWidth: number;
  readonly panelHeight: number;
  readonly labelWidth: number;
  readonly labelHeight: number;
};
export type Output = {
  readonly horizontalOffset: number;
  readonly verticalOffset: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    panelWidth: { type: "number", minimum: 0 },
    panelHeight: { type: "number", minimum: 0 },
    labelWidth: { type: "number", minimum: 0 },
    labelHeight: { type: "number", minimum: 0 },
  },
  required: ["panelWidth", "panelHeight", "labelWidth", "labelHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    horizontalOffset: { type: "number" },
    verticalOffset: { type: "number" },
    fits: { type: "boolean" },
  },
  required: ["horizontalOffset", "verticalOffset", "fits"],
} as const;
/** Center a rectangular label on a panel and report signed offsets plus geometric fit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { panelWidth, panelHeight, labelWidth, labelHeight } = request;
  const compute = (): Output => {
    H.domain(
      panelWidth >= 0 &&
        panelHeight >= 0 &&
        labelWidth >= 0 &&
        labelHeight >= 0,
      "panelWidth",
    );
    return {
      horizontalOffset: (panelWidth - labelWidth) / 2,
      verticalOffset: (panelHeight - labelHeight) / 2,
      fits: labelWidth <= panelWidth && labelHeight <= panelHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { panelWidth: 100, panelHeight: 60, labelWidth: 80, labelHeight: 40 },
  output: { horizontalOffset: 10, verticalOffset: 10, fits: true },
} satisfies ToolExample<Input, Output>;
export const labelPanelBorderOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/label-panel-border-offset",
    title: "Label Panel Border Offset Tool",
    description:
      "Center a rectangular label on a panel and report signed offsets plus geometric fit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        panelWidth: { type: "number", minimum: 0 },
        panelHeight: { type: "number", minimum: 0 },
        labelWidth: { type: "number", minimum: 0 },
        labelHeight: { type: "number", minimum: 0 },
      },
      required: ["panelWidth", "panelHeight", "labelWidth", "labelHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        horizontalOffset: { type: "number" },
        verticalOffset: { type: "number" },
        fits: { type: "boolean" },
      },
      required: ["horizontalOffset", "verticalOffset", "fits"],
    },
    ports: {
      inputs: [
        {
          id: "panelWidth",
          label: "Panel Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "panelHeight",
          label: "Panel Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "labelWidth",
          label: "Label Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "labelHeight",
          label: "Label Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "horizontalOffset",
          label: "Horizontal Offset",
          valueType: { type: "number" },
        },
        {
          id: "verticalOffset",
          label: "Vertical Offset",
          valueType: { type: "number" },
        },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = labelPanelBorderOffsetTool.execute;
export default labelPanelBorderOffsetTool;
