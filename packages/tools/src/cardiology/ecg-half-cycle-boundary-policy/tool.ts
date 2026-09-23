import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly phaseFraction: number;
  readonly boundaryToSecondHalf: boolean;
};
export type Output = { readonly half: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phaseFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    boundaryToSecondHalf: { type: "boolean" },
  },
  required: ["phaseFraction", "boundaryToSecondHalf"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { half: { type: "integer" } },
  required: ["half"],
} as const;
/** Assign a supplied normalized trace phase to halves with explicit midpoint ownership; no rhythm interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { phaseFraction, boundaryToSecondHalf } = request;
  const compute = (): Output => {
    H.domain(phaseFraction >= 0 && phaseFraction < 1);
    return {
      half:
        phaseFraction < 0.5 || (phaseFraction === 0.5 && !boundaryToSecondHalf)
          ? 1
          : 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { phaseFraction: 0.5, boundaryToSecondHalf: true },
  output: { half: 2 },
} satisfies ToolExample<Input, Output>;
export const ecgHalfCycleBoundaryPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cardiology/ecg-half-cycle-boundary-policy",
    title: "ECG Half Cycle Boundary Policy Tool",
    description:
      "Assign a supplied normalized trace phase to halves with explicit midpoint ownership; no rhythm interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phaseFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        boundaryToSecondHalf: { type: "boolean" },
      },
      required: ["phaseFraction", "boundaryToSecondHalf"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { half: { type: "integer" } },
      required: ["half"],
    },
    ports: {
      inputs: [
        {
          id: "phaseFraction",
          label: "Phase Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "boundaryToSecondHalf",
          label: "Boundary To Second Half",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "half", label: "Half", valueType: { type: "integer" } }],
    },
  },
  calculate,
});
export const run = ecgHalfCycleBoundaryPolicyTool.execute;
export default ecgHalfCycleBoundaryPolicyTool;
