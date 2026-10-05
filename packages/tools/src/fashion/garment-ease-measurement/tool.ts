import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bodyCircumference: number;
  readonly garmentCircumference: number;
};
export type Output = { readonly ease: number; readonly easePercent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bodyCircumference: { type: "number", exclusiveMinimum: 0 },
    garmentCircumference: { type: "number", minimum: 0 },
  },
  required: ["bodyCircumference", "garmentCircumference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ease: { type: "number" }, easePercent: { type: "number" } },
  required: ["ease", "easePercent"],
} as const;
/** Describe signed garment ease relative to a supplied body circumference; negative ease is allowed without a fit recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bodyCircumference, garmentCircumference } = request;
  const compute = (): Output => {
    (H.domain(bodyCircumference > 0, "bodyCircumference"), bodyCircumference);
    H.domain(garmentCircumference >= 0, "garmentCircumference");
    return {
      ease: garmentCircumference - bodyCircumference,
      easePercent:
        (100 * (garmentCircumference - bodyCircumference)) / bodyCircumference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bodyCircumference: 100, garmentCircumference: 108 },
  output: { ease: 8, easePercent: 8 },
} satisfies ToolExample<Input, Output>;
export const garmentEaseMeasurementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/garment-ease-measurement",
    title: "Garment Ease Measurement Tool",
    description:
      "Describe signed garment ease relative to a supplied body circumference; negative ease is allowed without a fit recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bodyCircumference: { type: "number", exclusiveMinimum: 0 },
        garmentCircumference: { type: "number", minimum: 0 },
      },
      required: ["bodyCircumference", "garmentCircumference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ease: { type: "number" }, easePercent: { type: "number" } },
      required: ["ease", "easePercent"],
    },
    ports: {
      inputs: [
        {
          id: "bodyCircumference",
          label: "Body Circumference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "garmentCircumference",
          label: "Garment Circumference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "ease", label: "Ease", valueType: { type: "number" } },
        {
          id: "easePercent",
          label: "Ease Percent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = garmentEaseMeasurementTool.execute;
export default garmentEaseMeasurementTool;
