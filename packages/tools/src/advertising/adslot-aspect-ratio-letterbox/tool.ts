import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contentWidth: number;
  readonly contentHeight: number;
  readonly slotWidth: number;
  readonly slotHeight: number;
};
export type Output = {
  readonly scale: number;
  readonly displayedWidth: number;
  readonly displayedHeight: number;
  readonly horizontalBarTotal: number;
  readonly verticalBarTotal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contentWidth: { type: "number", exclusiveMinimum: 0 },
    contentHeight: { type: "number", exclusiveMinimum: 0 },
    slotWidth: { type: "number", exclusiveMinimum: 0 },
    slotHeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["contentWidth", "contentHeight", "slotWidth", "slotHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scale: { type: "number" },
    displayedWidth: { type: "number" },
    displayedHeight: { type: "number" },
    horizontalBarTotal: { type: "number" },
    verticalBarTotal: { type: "number" },
  },
  required: [
    "scale",
    "displayedWidth",
    "displayedHeight",
    "horizontalBarTotal",
    "verticalBarTotal",
  ],
} as const;
/** Fit content proportionally within an ad slot and report combined top/bottom and left/right bar sizes, without cropping. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contentWidth, contentHeight, slotWidth, slotHeight } = request;
  const compute = (): Output => {
    (H.domain(contentWidth > 0, "contentWidth"), contentWidth);
    (H.domain(contentHeight > 0, "contentHeight"), contentHeight);
    (H.domain(slotWidth > 0, "slotWidth"), slotWidth);
    (H.domain(slotHeight > 0, "slotHeight"), slotHeight);
    return (() => {
      const scale = Math.min(
          slotWidth / contentWidth,
          slotHeight / contentHeight,
        ),
        displayedWidth = contentWidth * scale,
        displayedHeight = contentHeight * scale;
      return {
        scale,
        displayedWidth,
        displayedHeight,
        horizontalBarTotal: slotHeight - displayedHeight,
        verticalBarTotal: slotWidth - displayedWidth,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    contentWidth: 16,
    contentHeight: 9,
    slotWidth: 100,
    slotHeight: 100,
  },
  output: {
    scale: 6.25,
    displayedWidth: 100,
    displayedHeight: 56.25,
    horizontalBarTotal: 43.75,
    verticalBarTotal: 0,
  },
} satisfies ToolExample<Input, Output>;
export const adslotAspectRatioLetterboxTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "advertising/adslot-aspect-ratio-letterbox",
    title: "Adslot Aspect Ratio Letterbox Tool",
    description:
      "Fit content proportionally within an ad slot and report combined top/bottom and left/right bar sizes, without cropping.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contentWidth: { type: "number", exclusiveMinimum: 0 },
        contentHeight: { type: "number", exclusiveMinimum: 0 },
        slotWidth: { type: "number", exclusiveMinimum: 0 },
        slotHeight: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["contentWidth", "contentHeight", "slotWidth", "slotHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scale: { type: "number" },
        displayedWidth: { type: "number" },
        displayedHeight: { type: "number" },
        horizontalBarTotal: { type: "number" },
        verticalBarTotal: { type: "number" },
      },
      required: [
        "scale",
        "displayedWidth",
        "displayedHeight",
        "horizontalBarTotal",
        "verticalBarTotal",
      ],
    },
    ports: {
      inputs: [
        {
          id: "contentWidth",
          label: "Content Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "contentHeight",
          label: "Content Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "slotWidth",
          label: "Slot Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "slotHeight",
          label: "Slot Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "scale", label: "Scale", valueType: { type: "number" } },
        {
          id: "displayedWidth",
          label: "Displayed Width",
          valueType: { type: "number" },
        },
        {
          id: "displayedHeight",
          label: "Displayed Height",
          valueType: { type: "number" },
        },
        {
          id: "horizontalBarTotal",
          label: "Horizontal Bar Total",
          valueType: { type: "number" },
        },
        {
          id: "verticalBarTotal",
          label: "Vertical Bar Total",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = adslotAspectRatioLetterboxTool.execute;
export default adslotAspectRatioLetterboxTool;
