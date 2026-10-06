import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly signal: number; readonly rangeMeters: number };
export type Output = { readonly rangeSquaredCorrectedSignal: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signal: { type: "number" },
    rangeMeters: { type: "number", minimum: 0 },
  },
  required: ["signal", "rangeMeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rangeSquaredCorrectedSignal: { type: "number" } },
  required: ["rangeSquaredCorrectedSignal"],
} as const;
/** Apply the geometric range-squared factor to one background-corrected lidar signal sample without an atmospheric inversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signal, rangeMeters } = request;
  const compute = (): Output => {
    H.domain(rangeMeters >= 0, "rangeMeters");
    return { rangeSquaredCorrectedSignal: signal * rangeMeters ** 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signal: 2, rangeMeters: 100 },
  output: { rangeSquaredCorrectedSignal: 20000 },
} satisfies ToolExample<Input, Output>;
export const lidarRangeSquaredFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["atmospheric-physics", "atmospheric physics", "physics"],
      keywords: ["atmospheric physics", "physics"],
    },
    id: "atmospheric-physics/lidar-range-squared-factor",
    title: "Lidar Range Squared Factor",
    description:
      "Apply the geometric range-squared factor to one background-corrected lidar signal sample without an atmospheric inversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signal: { type: "number" },
        rangeMeters: { type: "number", minimum: 0 },
      },
      required: ["signal", "rangeMeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rangeSquaredCorrectedSignal: { type: "number" } },
      required: ["rangeSquaredCorrectedSignal"],
    },
    ports: {
      inputs: [
        {
          id: "signal",
          label: "Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rangeMeters",
          label: "Range Meters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rangeSquaredCorrectedSignal",
          label: "Range Squared Corrected Signal",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lidarRangeSquaredFactorTool.execute;
export default lidarRangeSquaredFactorTool;
