import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly iqr: number; readonly scale: number };
export type Output = { readonly transformedIqr: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    iqr: { type: "number", minimum: 0 },
    scale: { type: "number" },
  },
  required: ["iqr", "scale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { transformedIqr: { type: "number" } },
  required: ["transformedIqr"],
} as const;
/** Calculate robust scaler iqr unit shift from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { iqr, scale } = request;
  const compute = (): Output => {
    H.domain(iqr >= 0 && scale !== 0);
    return { transformedIqr: iqr * Math.abs(scale) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { iqr: 3, scale: -2 },
  output: { transformedIqr: 6 },
} satisfies ToolExample<Input, Output>;
export const robustScalerIqrUnitShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/robust-scaler-iqr-unit-shift",
    title: "Robust Scaler IQR Unit Shift Tool",
    description:
      "Calculate robust scaler iqr unit shift from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        iqr: { type: "number", minimum: 0 },
        scale: { type: "number" },
      },
      required: ["iqr", "scale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { transformedIqr: { type: "number" } },
      required: ["transformedIqr"],
    },
    ports: {
      inputs: [
        {
          id: "iqr",
          label: "Iqr",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scale",
          label: "Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "transformedIqr",
          label: "Transformed Iqr",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = robustScalerIqrUnitShiftTool.execute;
export default robustScalerIqrUnitShiftTool;
