import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly canvasWidth: number;
  readonly stretcherWidth: number;
};
export type Output = { readonly equalSideInset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    canvasWidth: { type: "number", minimum: 0 },
    stretcherWidth: { type: "number", minimum: 0 },
  },
  required: ["canvasWidth", "stretcherWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { equalSideInset: { type: "number" } },
  required: ["equalSideInset"],
} as const;
/** Calculate explicit equal-side canvas inset relative to a centered stretcher width without selecting conservation or framing methods. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { canvasWidth, stretcherWidth } = request;
  const compute = (): Output => {
    H.domain(canvasWidth >= 0 && stretcherWidth >= 0, "canvasWidth");
    return { equalSideInset: (canvasWidth - stretcherWidth) / 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { canvasWidth: 100, stretcherWidth: 96 },
  output: { equalSideInset: 2 },
} satisfies ToolExample<Input, Output>;
export const canvasStretcherInsetClearanceTool = H.defineSchemaCalculation<
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
    id: "visual-arts/canvas-stretcher-inset-clearance",
    title: "Canvas Stretcher Inset Clearance",
    description:
      "Calculate explicit equal-side canvas inset relative to a centered stretcher width without selecting conservation or framing methods.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        canvasWidth: { type: "number", minimum: 0 },
        stretcherWidth: { type: "number", minimum: 0 },
      },
      required: ["canvasWidth", "stretcherWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { equalSideInset: { type: "number" } },
      required: ["equalSideInset"],
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
          id: "stretcherWidth",
          label: "Stretcher Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "equalSideInset",
          label: "Equal Side Inset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = canvasStretcherInsetClearanceTool.execute;
export default canvasStretcherInsetClearanceTool;
