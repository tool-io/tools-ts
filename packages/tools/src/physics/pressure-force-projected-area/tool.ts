import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pressureDifferencePa: number;
  readonly projectedAreaSquareMeters: number;
};
export type Output = { readonly forceNewtons: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pressureDifferencePa: { type: "number" },
    projectedAreaSquareMeters: { type: "number", minimum: 0 },
  },
  required: ["pressureDifferencePa", "projectedAreaSquareMeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { forceNewtons: { type: "number" } },
  required: ["forceNewtons"],
} as const;
/** Return signed force from a uniform pressure difference acting on a nonnegative projected area. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pressureDifferencePa, projectedAreaSquareMeters } = request;
  const compute = (): Output => {
    H.domain(projectedAreaSquareMeters >= 0, "projectedAreaSquareMeters");
    return { forceNewtons: pressureDifferencePa * projectedAreaSquareMeters };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pressureDifferencePa: 2500, projectedAreaSquareMeters: 0.04 },
  output: { forceNewtons: 100 },
} satisfies ToolExample<Input, Output>;
export const pressureForceProjectedAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/pressure-force-projected-area",
    title: "Pressure Force Projected Area Tool",
    description:
      "Return signed force from a uniform pressure difference acting on a nonnegative projected area.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pressureDifferencePa: { type: "number" },
        projectedAreaSquareMeters: { type: "number", minimum: 0 },
      },
      required: ["pressureDifferencePa", "projectedAreaSquareMeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { forceNewtons: { type: "number" } },
      required: ["forceNewtons"],
    },
    ports: {
      inputs: [
        {
          id: "pressureDifferencePa",
          label: "Pressure Difference Pa",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "projectedAreaSquareMeters",
          label: "Projected Area Square Meters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "forceNewtons",
          label: "Force Newtons",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pressureForceProjectedAreaTool.execute;
export default pressureForceProjectedAreaTool;
