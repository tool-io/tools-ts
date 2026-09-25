import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly boxStart: number;
  readonly boxEnd: number;
  readonly origin: number;
  readonly affinity: string;
};
export type Output = { readonly relativeAnchor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    boxStart: { type: "number" },
    boxEnd: { type: "number" },
    origin: { type: "number" },
    affinity: { type: "string", maxLength: 8192, enum: ["start", "end"] },
  },
  required: ["boxStart", "boxEnd", "origin", "affinity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeAnchor: { type: "number" } },
  required: ["relativeAnchor"],
} as const;
/** Choose a supplied OCR word-box edge before translating its origin. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { boxStart, boxEnd, origin, affinity } = request;
  const compute = (): Output => {
    H.domain(boxEnd >= boxStart && ["start", "end"].includes(affinity));
    return {
      relativeAnchor: (affinity === "start" ? boxStart : boxEnd) - origin,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { boxStart: 10, boxEnd: 30, origin: 5, affinity: "start" },
  output: { relativeAnchor: 5 },
} satisfies ToolExample<Input, Output>;
export const ocrWordOriginAffinityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/ocr-word-origin-affinity",
    title: "OCR Word Origin Affinity Tool",
    description:
      "Choose a supplied OCR word-box edge before translating its origin.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        boxStart: { type: "number" },
        boxEnd: { type: "number" },
        origin: { type: "number" },
        affinity: { type: "string", maxLength: 8192, enum: ["start", "end"] },
      },
      required: ["boxStart", "boxEnd", "origin", "affinity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { relativeAnchor: { type: "number" } },
      required: ["relativeAnchor"],
    },
    ports: {
      inputs: [
        {
          id: "boxStart",
          label: "Box Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "boxEnd",
          label: "Box End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "affinity",
          label: "Affinity",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "relativeAnchor",
          label: "Relative Anchor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ocrWordOriginAffinityTool.execute;
export default ocrWordOriginAffinityTool;
