import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly duration: number;
  readonly suppliedBoundary: number;
};
export type Output = { readonly gap: number; readonly exceeds: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    duration: { type: "number", minimum: 0 },
    suppliedBoundary: { type: "number", minimum: 0 },
  },
  required: ["duration", "suppliedBoundary"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" }, exceeds: { type: "boolean" } },
  required: ["gap", "exceeds"],
} as const;
/** Calculate trip duration boundary gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { duration, suppliedBoundary } = request;
  const compute = (): Output => {
    H.domain(duration >= 0 && suppliedBoundary >= 0);
    return {
      gap: duration - suppliedBoundary,
      exceeds: duration > suppliedBoundary,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { duration: 45, suppliedBoundary: 30 },
  output: { gap: 15, exceeds: true },
} satisfies ToolExample<Input, Output>;
export const tripDurationBoundaryGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/trip-duration-boundary-gap",
    title: "Trip Duration Boundary Gap Tool",
    description:
      "Calculate trip duration boundary gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        duration: { type: "number", minimum: 0 },
        suppliedBoundary: { type: "number", minimum: 0 },
      },
      required: ["duration", "suppliedBoundary"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" }, exceeds: { type: "boolean" } },
      required: ["gap", "exceeds"],
    },
    ports: {
      inputs: [
        {
          id: "duration",
          label: "Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedBoundary",
          label: "Supplied Boundary",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        { id: "exceeds", label: "Exceeds", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = tripDurationBoundaryGapTool.execute;
export default tripDurationBoundaryGapTool;
