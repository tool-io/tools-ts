import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vintageAt: number;
  readonly forecastOrigin: number;
};
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vintageAt: { type: "number" },
    forecastOrigin: { type: "number" },
  },
  required: ["vintageAt", "forecastOrigin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" } },
  required: ["gap"],
} as const;
/** Calculate forecast vintage origin gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vintageAt, forecastOrigin } = request;
  const compute = (): Output => {
    return { gap: vintageAt - forecastOrigin };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { vintageAt: 20, forecastOrigin: 15 },
  output: { gap: 5 },
} satisfies ToolExample<Input, Output>;
export const forecastVintageOriginGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-analytics/forecast-vintage-origin-gap",
    title: "Forecast Vintage Origin Gap Tool",
    description:
      "Calculate forecast vintage origin gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vintageAt: { type: "number" },
        forecastOrigin: { type: "number" },
      },
      required: ["vintageAt", "forecastOrigin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" } },
      required: ["gap"],
    },
    ports: {
      inputs: [
        {
          id: "vintageAt",
          label: "Vintage At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "forecastOrigin",
          label: "Forecast Origin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "gap", label: "Gap", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = forecastVintageOriginGapTool.execute;
export default forecastVintageOriginGapTool;
