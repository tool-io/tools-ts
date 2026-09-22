import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly width: number;
  readonly height: number;
  readonly verticalCount: number;
  readonly verticalWidth: number;
  readonly horizontalCount: number;
  readonly horizontalWidth: number;
};
export type Output = {
  readonly frameArea: number;
  readonly frameFraction: number;
  readonly clearArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number", exclusiveMinimum: 0 },
    height: { type: "number", exclusiveMinimum: 0 },
    verticalCount: { type: "integer", minimum: 0 },
    verticalWidth: { type: "number", minimum: 0 },
    horizontalCount: { type: "integer", minimum: 0 },
    horizontalWidth: { type: "number", minimum: 0 },
  },
  required: [
    "width",
    "height",
    "verticalCount",
    "verticalWidth",
    "horizontalCount",
    "horizontalWidth",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frameArea: { type: "number" },
    frameFraction: { type: "number" },
    clearArea: { type: "number" },
  },
  required: ["frameArea", "frameFraction", "clearArea"],
} as const;
/** Deduct overlapping rectangular full-span mullions once when estimating a regular facade frame fraction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    width,
    height,
    verticalCount,
    verticalWidth,
    horizontalCount,
    horizontalWidth,
  } = request;
  const compute = (): Output => {
    H.positive(width);
    H.positive(height);
    H.integer(verticalCount, 0);
    H.integer(horizontalCount, 0);
    H.domain(
      verticalWidth >= 0 &&
        horizontalWidth >= 0 &&
        verticalCount * verticalWidth <= width &&
        horizontalCount * horizontalWidth <= height,
    );
    return {
      frameArea:
        verticalCount * verticalWidth * height +
        horizontalCount * horizontalWidth * width -
        verticalCount * horizontalCount * verticalWidth * horizontalWidth,
      frameFraction:
        (verticalCount * verticalWidth * height +
          horizontalCount * horizontalWidth * width -
          verticalCount * horizontalCount * verticalWidth * horizontalWidth) /
        (width * height),
      clearArea:
        (width - verticalCount * verticalWidth) *
        (height - horizontalCount * horizontalWidth),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    width: 10,
    height: 5,
    verticalCount: 2,
    verticalWidth: 0.1,
    horizontalCount: 1,
    horizontalWidth: 0.2,
  },
  output: { frameArea: 2.96, frameFraction: 0.0592, clearArea: 47.04 },
} satisfies ToolExample<Input, Output>;
export const glazedFacadeMullionAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/glazed-facade-mullion-area-share",
    title: "Glazed Facade Mullion Area Share Tool",
    description:
      "Deduct overlapping rectangular full-span mullions once when estimating a regular facade frame fraction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number", exclusiveMinimum: 0 },
        height: { type: "number", exclusiveMinimum: 0 },
        verticalCount: { type: "integer", minimum: 0 },
        verticalWidth: { type: "number", minimum: 0 },
        horizontalCount: { type: "integer", minimum: 0 },
        horizontalWidth: { type: "number", minimum: 0 },
      },
      required: [
        "width",
        "height",
        "verticalCount",
        "verticalWidth",
        "horizontalCount",
        "horizontalWidth",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frameArea: { type: "number" },
        frameFraction: { type: "number" },
        clearArea: { type: "number" },
      },
      required: ["frameArea", "frameFraction", "clearArea"],
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
          id: "verticalCount",
          label: "Vertical Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "verticalWidth",
          label: "Vertical Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "horizontalCount",
          label: "Horizontal Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "horizontalWidth",
          label: "Horizontal Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "frameArea", label: "Frame Area", valueType: { type: "number" } },
        {
          id: "frameFraction",
          label: "Frame Fraction",
          valueType: { type: "number" },
        },
        { id: "clearArea", label: "Clear Area", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = glazedFacadeMullionAreaShareTool.execute;
export default glazedFacadeMullionAreaShareTool;
