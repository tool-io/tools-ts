import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly force: number;
  readonly area: number;
  readonly initialThickness: number;
  readonly displacement: number;
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
    area: { type: "number", exclusiveMinimum: 0 },
    initialThickness: { type: "number", exclusiveMinimum: 0 },
    displacement: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["force", "area", "initialThickness", "displacement"],
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
/** Compression secant modulus for supplied uniform bench geometry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { force, area, initialThickness, displacement } = request;
  const compute = (): Output => {
    H.domain(force >= 0);
    H.positive(area);
    H.positive(initialThickness);
    H.positive(displacement);
    return {
      stress: force / area,
      strain: displacement / initialThickness,
      secantModulus: (force * initialThickness) / (area * displacement),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { force: 100, area: 20, initialThickness: 10, displacement: 2 },
  output: { stress: 5, strain: 0.2, secantModulus: 25 },
} satisfies ToolExample<Input, Output>;
export const orthoticBenchCompressionModulusTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "podiatry/orthotic-bench-compression-modulus-term",
      title: "Orthotic Bench Compression Modulus Term Tool",
      description:
        "Compression secant modulus for supplied uniform bench geometry.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          force: { type: "number", minimum: 0 },
          area: { type: "number", exclusiveMinimum: 0 },
          initialThickness: { type: "number", exclusiveMinimum: 0 },
          displacement: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["force", "area", "initialThickness", "displacement"],
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
            id: "area",
            label: "Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "initialThickness",
            label: "Initial Thickness",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "displacement",
            label: "Displacement",
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
export const run = orthoticBenchCompressionModulusTermTool.execute;
export default orthoticBenchCompressionModulusTermTool;
