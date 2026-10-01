import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly appliedForce: number;
  readonly contactArea: number;
  readonly participatingFraction: number;
};
export type Output = {
  readonly effectiveArea: number;
  readonly meanPressure: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    appliedForce: { type: "number", minimum: 0 },
    contactArea: { type: "number", exclusiveMinimum: 0 },
    participatingFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["appliedForce", "contactArea", "participatingFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveArea: { type: "number" },
    meanPressure: { type: "number" },
  },
  required: ["effectiveArea", "meanPressure"],
} as const;
/** Bench mean force/effective-area pressure, excluding local pressure distribution or tissue tolerance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { appliedForce, contactArea, participatingFraction } = request;
  const compute = (): Output => {
    H.domain(
      appliedForce >= 0 &&
        participatingFraction > 0 &&
        participatingFraction <= 1,
    );
    H.positive(contactArea);
    return {
      effectiveArea: contactArea * participatingFraction,
      meanPressure: appliedForce / (contactArea * participatingFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { appliedForce: 100, contactArea: 20, participatingFraction: 0.5 },
  output: { effectiveArea: 10, meanPressure: 10 },
} satisfies ToolExample<Input, Output>;
export const orthosisBenchPressureAreaFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthopedics/orthosis-bench-pressure-area-factor",
    title: "Orthosis Bench Pressure Area Factor Tool",
    description:
      "Bench mean force/effective-area pressure, excluding local pressure distribution or tissue tolerance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        appliedForce: { type: "number", minimum: 0 },
        contactArea: { type: "number", exclusiveMinimum: 0 },
        participatingFraction: {
          type: "number",
          exclusiveMinimum: 0,
          maximum: 1,
        },
      },
      required: ["appliedForce", "contactArea", "participatingFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveArea: { type: "number" },
        meanPressure: { type: "number" },
      },
      required: ["effectiveArea", "meanPressure"],
    },
    ports: {
      inputs: [
        {
          id: "appliedForce",
          label: "Applied Force",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "contactArea",
          label: "Contact Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "participatingFraction",
          label: "Participating Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "effectiveArea",
          label: "Effective Area",
          valueType: { type: "number" },
        },
        {
          id: "meanPressure",
          label: "Mean Pressure",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = orthosisBenchPressureAreaFactorTool.execute;
export default orthosisBenchPressureAreaFactorTool;
