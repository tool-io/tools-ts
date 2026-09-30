import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly start: number;
  readonly end: number;
  readonly horizon: number;
};
export type Output = { readonly included: number; readonly weight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "integer", minimum: 0 },
    end: { type: "integer" },
    horizon: { type: "integer", minimum: 1 },
  },
  required: ["start", "end", "horizon"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { included: { type: "integer" }, weight: { type: "number" } },
  required: ["included", "weight"],
} as const;
/** Compute forecast overlap horizon weight from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { start, end, horizon } = input;
  const compute = (): Output => {
    integer(start);
    integer(end, start);
    integer(horizon, 1);
    const included = Math.max(
      0,
      Math.min(end, horizon) - Math.min(start, horizon),
    );
    return { included, weight: included / horizon };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { start: 2, end: 6, horizon: 4 },
  output: { included: 2, weight: 0.5 },
} satisfies ToolExample<Input, Output>;
export const forecastOverlapHorizonWeightTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "metrics/forecast-overlap-horizon-weight",
  title: "Forecast Overlap Horizon Weight Tool",
  description:
    "Compute forecast overlap horizon weight from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "start",
        label: "Start",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "end",
        label: "End",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "horizon",
        label: "Horizon",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "included", label: "Included", valueType: { type: "integer" } },
      { id: "weight", label: "Weight", valueType: { type: "number" } },
    ],
  },
});
export const run = forecastOverlapHorizonWeightTool.execute;
export default forecastOverlapHorizonWeightTool;
