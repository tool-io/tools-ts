import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hubblePerSecond: number;
  readonly gravitationalConstant: number;
};
export type Output = { readonly criticalDensity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hubblePerSecond: { type: "number", minimum: 0 },
    gravitationalConstant: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["hubblePerSecond", "gravitationalConstant"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { criticalDensity: { type: "number" } },
  required: ["criticalDensity"],
} as const;
/** Critical density 3H squared/(8*pi*G); H must be in inverse seconds when G is SI. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hubblePerSecond, gravitationalConstant } = request;
  const compute = (): Output => {
    H.domain(hubblePerSecond >= 0);
    H.positive(gravitationalConstant);
    return {
      criticalDensity:
        (3 * hubblePerSecond ** 2) / (8 * Math.PI * gravitationalConstant),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { hubblePerSecond: 2, gravitationalConstant: 0.1193662073189215 },
  output: { criticalDensity: 4 },
} satisfies ToolExample<Input, Output>;
export const criticalDensityHubbleSquaredFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cosmology/critical-density-hubble-squared-factor",
    title: "Critical Density Hubble Squared Factor Tool",
    description:
      "Critical density 3H squared/(8*pi*G); H must be in inverse seconds when G is SI.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hubblePerSecond: { type: "number", minimum: 0 },
        gravitationalConstant: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["hubblePerSecond", "gravitationalConstant"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { criticalDensity: { type: "number" } },
      required: ["criticalDensity"],
    },
    ports: {
      inputs: [
        {
          id: "hubblePerSecond",
          label: "Hubble Per Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gravitationalConstant",
          label: "Gravitational Constant",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "criticalDensity",
          label: "Critical Density",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = criticalDensityHubbleSquaredFactorTool.execute;
export default criticalDensityHubbleSquaredFactorTool;
