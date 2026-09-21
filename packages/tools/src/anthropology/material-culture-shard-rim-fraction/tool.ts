import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preservedArc: number;
  readonly reconstructedCircumference: number;
};
export type Output = { readonly rimFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preservedArc: { type: "number", minimum: 0 },
    reconstructedCircumference: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["preservedArc", "reconstructedCircumference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rimFraction: { type: "number" } },
  required: ["rimFraction"],
} as const;
/** Calculate material culture shard rim fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { preservedArc, reconstructedCircumference } = request;
  const compute = (): Output => {
    H.domain(preservedArc >= 0);
    H.positive(reconstructedCircumference);
    H.domain(preservedArc <= reconstructedCircumference);
    return { rimFraction: preservedArc / reconstructedCircumference };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { preservedArc: 12, reconstructedCircumference: 60 },
  output: { rimFraction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const materialCultureShardRimFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anthropology/material-culture-shard-rim-fraction",
    title: "Material Culture Shard Rim Fraction Tool",
    description:
      "Calculate material culture shard rim fraction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preservedArc: { type: "number", minimum: 0 },
        reconstructedCircumference: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["preservedArc", "reconstructedCircumference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rimFraction: { type: "number" } },
      required: ["rimFraction"],
    },
    ports: {
      inputs: [
        {
          id: "preservedArc",
          label: "Preserved Arc",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reconstructedCircumference",
          label: "Reconstructed Circumference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rimFraction",
          label: "Rim Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = materialCultureShardRimFractionTool.execute;
export default materialCultureShardRimFractionTool;
