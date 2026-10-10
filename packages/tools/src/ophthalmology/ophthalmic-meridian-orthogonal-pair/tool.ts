import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly axisDegrees: number };
export type Output = {
  readonly firstAxisDegrees: number;
  readonly orthogonalAxisDegrees: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    axisDegrees: { type: "number", minimum: 0, exclusiveMaximum: 180 },
  },
  required: ["axisDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAxisDegrees: { type: "number" },
    orthogonalAxisDegrees: { type: "number" },
  },
  required: ["firstAxisDegrees", "orthogonalAxisDegrees"],
} as const;
/** Pair an explicitly supplied zero-inclusive half-turn axis with its orthogonal meridian without interpreting ocular power. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { axisDegrees } = request;
  const compute = (): Output => {
    H.domain(axisDegrees >= 0 && axisDegrees < 180, "axisDegrees");
    return {
      firstAxisDegrees: axisDegrees,
      orthogonalAxisDegrees: (axisDegrees + 90) % 180,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { axisDegrees: 30 },
  output: { firstAxisDegrees: 30, orthogonalAxisDegrees: 120 },
} satisfies ToolExample<Input, Output>;
export const ophthalmicMeridianOrthogonalPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["ophthalmology", "health and medicine"],
      keywords: ["ophthalmology", "health and medicine"],
    },
    id: "ophthalmology/ophthalmic-meridian-orthogonal-pair",
    title: "Ophthalmic Meridian Orthogonal Pair",
    description:
      "Pair an explicitly supplied zero-inclusive half-turn axis with its orthogonal meridian without interpreting ocular power.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        axisDegrees: { type: "number", minimum: 0, exclusiveMaximum: 180 },
      },
      required: ["axisDegrees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstAxisDegrees: { type: "number" },
        orthogonalAxisDegrees: { type: "number" },
      },
      required: ["firstAxisDegrees", "orthogonalAxisDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "axisDegrees",
          label: "Axis Degrees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstAxisDegrees",
          label: "First Axis Degrees",
          valueType: { type: "number" },
        },
        {
          id: "orthogonalAxisDegrees",
          label: "Orthogonal Axis Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ophthalmicMeridianOrthogonalPairTool.execute;
export default ophthalmicMeridianOrthogonalPairTool;
