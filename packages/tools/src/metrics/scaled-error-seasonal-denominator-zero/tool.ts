import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly absoluteError: number;
  readonly seasonalScale: number;
};
export type Output = { readonly defined: boolean; readonly value: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    absoluteError: { type: "number", minimum: 0 },
    seasonalScale: { type: "number", minimum: 0 },
  },
  required: ["absoluteError", "seasonalScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { defined: { type: "boolean" }, value: { type: "number" } },
  required: ["defined", "value"],
} as const;
/** Calculate scaled error seasonal denominator zero from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { absoluteError, seasonalScale } = request;
  const compute = (): Output => {
    H.domain(absoluteError >= 0 && seasonalScale >= 0);
    const defined = seasonalScale > 0;
    return { defined, value: defined ? absoluteError / seasonalScale : 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { absoluteError: 3, seasonalScale: 0 },
  output: { defined: false, value: 0 },
} satisfies ToolExample<Input, Output>;
export const scaledErrorSeasonalDenominatorZeroTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/scaled-error-seasonal-denominator-zero",
    title: "Scaled Error Seasonal Denominator Zero Tool",
    description:
      "Calculate scaled error seasonal denominator zero from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        absoluteError: { type: "number", minimum: 0 },
        seasonalScale: { type: "number", minimum: 0 },
      },
      required: ["absoluteError", "seasonalScale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { defined: { type: "boolean" }, value: { type: "number" } },
      required: ["defined", "value"],
    },
    ports: {
      inputs: [
        {
          id: "absoluteError",
          label: "Absolute Error",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "seasonalScale",
          label: "Seasonal Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        { id: "value", label: "Value", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = scaledErrorSeasonalDenominatorZeroTool.execute;
export default scaledErrorSeasonalDenominatorZeroTool;
