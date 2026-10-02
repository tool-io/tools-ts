import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly force: number;
  readonly span: number;
  readonly width: number;
  readonly thickness: number;
  readonly deflection: number;
};
export type Output = {
  readonly stress: number;
  readonly strain: number;
  readonly secantModulus: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    force: { type: "number", minimum: 0 },
    span: { type: "number", exclusiveMinimum: 0 },
    width: { type: "number", exclusiveMinimum: 0 },
    thickness: { type: "number", exclusiveMinimum: 0 },
    deflection: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["force", "span", "width", "thickness", "deflection"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stress: { type: "number" },
    strain: { type: "number" },
    secantModulus: { type: "number" },
  },
  required: ["stress", "strain", "secantModulus"],
} as const;
/** Ideal rectangular three-point bend stress/strain and secant modulus from explicit bench geometry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { force, span, width, thickness, deflection } = request;
  const compute = (): Output => {
    H.domain(force >= 0);
    H.positive(span);
    H.positive(width);
    H.positive(thickness);
    H.positive(deflection);
    return {
      stress: (3 * force * span) / (2 * width * thickness ** 2),
      strain: (6 * deflection * thickness) / span ** 2,
      secantModulus:
        (force * span ** 3) / (4 * width * thickness ** 3 * deflection),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { force: 10, span: 20, width: 5, thickness: 2, deflection: 0.5 },
  output: { stress: 15, strain: 0.015, secantModulus: 1000 },
} satisfies ToolExample<Input, Output>;
export const dentureBenchFlexuralSpanFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "prosthodontics/denture-bench-flexural-span-factor",
    title: "Denture Bench Flexural Span Factor Tool",
    description:
      "Ideal rectangular three-point bend stress/strain and secant modulus from explicit bench geometry.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        force: { type: "number", minimum: 0 },
        span: { type: "number", exclusiveMinimum: 0 },
        width: { type: "number", exclusiveMinimum: 0 },
        thickness: { type: "number", exclusiveMinimum: 0 },
        deflection: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["force", "span", "width", "thickness", "deflection"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stress: { type: "number" },
        strain: { type: "number" },
        secantModulus: { type: "number" },
      },
      required: ["stress", "strain", "secantModulus"],
    },
    ports: {
      inputs: [
        {
          id: "force",
          label: "Force",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "span",
          label: "Span",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "thickness",
          label: "Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deflection",
          label: "Deflection",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "stress", label: "Stress", valueType: { type: "number" } },
        { id: "strain", label: "Strain", valueType: { type: "number" } },
        {
          id: "secantModulus",
          label: "Secant Modulus",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dentureBenchFlexuralSpanFactorTool.execute;
export default dentureBenchFlexuralSpanFactorTool;
