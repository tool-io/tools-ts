import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pulseSeconds: number;
  readonly propagationSpeed: number;
};
export type Output = { readonly rangeResolution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pulseSeconds: { type: "number", minimum: 0 },
    propagationSpeed: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["pulseSeconds", "propagationSpeed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rangeResolution: { type: "number" } },
  required: ["rangeResolution"],
} as const;
/** Uncompressed monostatic pulse range resolution from two-way propagation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pulseSeconds, propagationSpeed } = request;
  const compute = (): Output => {
    H.domain(pulseSeconds >= 0);
    H.positive(propagationSpeed);
    return { rangeResolution: (pulseSeconds * propagationSpeed) / 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pulseSeconds: 0.000001, propagationSpeed: 300000000 },
  output: { rangeResolution: 150 },
} satisfies ToolExample<Input, Output>;
export const radarRangeResolutionPulseWidthTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-physics/radar-range-resolution-pulse-width-term",
    title: "Radar Range Resolution Pulse Width Term Tool",
    description:
      "Uncompressed monostatic pulse range resolution from two-way propagation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pulseSeconds: { type: "number", minimum: 0 },
        propagationSpeed: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["pulseSeconds", "propagationSpeed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rangeResolution: { type: "number" } },
      required: ["rangeResolution"],
    },
    ports: {
      inputs: [
        {
          id: "pulseSeconds",
          label: "Pulse Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "propagationSpeed",
          label: "Propagation Speed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rangeResolution",
          label: "Range Resolution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = radarRangeResolutionPulseWidthTermTool.execute;
export default radarRangeResolutionPulseWidthTermTool;
