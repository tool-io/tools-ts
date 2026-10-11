import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly imageWidth: number;
  readonly windowWidth: number;
};
export type Output = { readonly coveredWidthEachSide: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageWidth: { type: "number", minimum: 0 },
    windowWidth: { type: "number", minimum: 0 },
  },
  required: ["imageWidth", "windowWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { coveredWidthEachSide: { type: "number" } },
  required: ["coveredWidthEachSide"],
} as const;
/** Compare explicit centered image and mat-window widths, preserving a larger window as negative overlap. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { imageWidth, windowWidth } = request;
  const compute = (): Output => {
    H.domain(imageWidth >= 0 && windowWidth >= 0, "imageWidth");
    return { coveredWidthEachSide: (imageWidth - windowWidth) / 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { imageWidth: 30, windowWidth: 28 },
  output: { coveredWidthEachSide: 1 },
} satisfies ToolExample<Input, Output>;
export const matBoardWindowRevealWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["visual-arts", "visual arts", "arts and design"],
      keywords: ["visual arts", "arts and design"],
    },
    id: "visual-arts/mat-board-window-reveal-width",
    title: "Mat Board Window Reveal Width",
    description:
      "Compare explicit centered image and mat-window widths, preserving a larger window as negative overlap.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        imageWidth: { type: "number", minimum: 0 },
        windowWidth: { type: "number", minimum: 0 },
      },
      required: ["imageWidth", "windowWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { coveredWidthEachSide: { type: "number" } },
      required: ["coveredWidthEachSide"],
    },
    ports: {
      inputs: [
        {
          id: "imageWidth",
          label: "Image Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowWidth",
          label: "Window Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "coveredWidthEachSide",
          label: "Covered Width Each Side",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = matBoardWindowRevealWidthTool.execute;
export default matBoardWindowRevealWidthTool;
