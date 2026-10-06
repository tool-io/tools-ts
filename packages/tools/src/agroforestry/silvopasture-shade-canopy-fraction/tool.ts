import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly markedShadedArea: number;
  readonly observedArea: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    markedShadedArea: { type: "number", minimum: 0 },
    observedArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["markedShadedArea", "observedArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Normalize explicitly marked shaded area to compatible observed area without predicting moving shade or pasture response. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { markedShadedArea, observedArea } = request;
  const compute = (): Output => {
    (H.domain(observedArea > 0, "observedArea"), observedArea);
    H.domain(
      markedShadedArea >= 0 && markedShadedArea <= observedArea,
      "markedShadedArea",
    );
    return {
      fraction: markedShadedArea / observedArea,
      remainder: observedArea - markedShadedArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { markedShadedArea: 30, observedArea: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const silvopastureShadeCanopyFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroforestry", "agriculture"],
      keywords: ["agroforestry", "agriculture"],
    },
    id: "agroforestry/silvopasture-shade-canopy-fraction",
    title: "Silvopasture Shade Canopy Fraction",
    description:
      "Normalize explicitly marked shaded area to compatible observed area without predicting moving shade or pasture response.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        markedShadedArea: { type: "number", minimum: 0 },
        observedArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["markedShadedArea", "observedArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "markedShadedArea",
          label: "Marked Shaded Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedArea",
          label: "Observed Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = silvopastureShadeCanopyFractionTool.execute;
export default silvopastureShadeCanopyFractionTool;
