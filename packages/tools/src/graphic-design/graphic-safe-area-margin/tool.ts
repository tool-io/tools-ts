import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly canvasWidth: number;
  readonly canvasHeight: number;
  readonly inset: number;
};
export type Output = {
  readonly safeWidth: number;
  readonly safeHeight: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    canvasWidth: { type: "number", minimum: 0 },
    canvasHeight: { type: "number", minimum: 0 },
    inset: { type: "number", minimum: 0 },
  },
  required: ["canvasWidth", "canvasHeight", "inset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    safeWidth: { type: "number" },
    safeHeight: { type: "number" },
    fits: { type: "boolean" },
  },
  required: ["safeWidth", "safeHeight", "fits"],
} as const;
/** Subtract a supplied symmetric safe-area inset while retaining negative dimensions to report a nonfitting request. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { canvasWidth, canvasHeight, inset } = request;
  const compute = (): Output => {
    H.domain(
      canvasWidth >= 0 && canvasHeight >= 0 && inset >= 0,
      "canvasWidth",
    );
    return {
      safeWidth: canvasWidth - 2 * inset,
      safeHeight: canvasHeight - 2 * inset,
      fits: canvasWidth >= 2 * inset && canvasHeight >= 2 * inset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { canvasWidth: 100, canvasHeight: 60, inset: 5 },
  output: { safeWidth: 90, safeHeight: 50, fits: true },
} satisfies ToolExample<Input, Output>;
export const graphicSafeAreaMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["graphic-design", "graphic design", "arts and design"],
      keywords: ["graphic design", "arts and design"],
    },
    id: "graphic-design/graphic-safe-area-margin",
    title: "Graphic Safe Area Margin",
    description:
      "Subtract a supplied symmetric safe-area inset while retaining negative dimensions to report a nonfitting request.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        canvasWidth: { type: "number", minimum: 0 },
        canvasHeight: { type: "number", minimum: 0 },
        inset: { type: "number", minimum: 0 },
      },
      required: ["canvasWidth", "canvasHeight", "inset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        safeWidth: { type: "number" },
        safeHeight: { type: "number" },
        fits: { type: "boolean" },
      },
      required: ["safeWidth", "safeHeight", "fits"],
    },
    ports: {
      inputs: [
        {
          id: "canvasWidth",
          label: "Canvas Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "canvasHeight",
          label: "Canvas Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inset",
          label: "Inset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "safeWidth", label: "Safe Width", valueType: { type: "number" } },
        {
          id: "safeHeight",
          label: "Safe Height",
          valueType: { type: "number" },
        },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = graphicSafeAreaMarginTool.execute;
export default graphicSafeAreaMarginTool;
