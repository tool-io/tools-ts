import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly particleId: string;
  readonly suppliedRoundnessText: string;
  readonly referenceScale: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    particleId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedRoundnessText: { type: "string", maxLength: 8192, minLength: 1 },
    referenceScale: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["particleId", "suppliedRoundnessText", "referenceScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit sediment particle roundness transcription and reference scale without image classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { particleId, suppliedRoundnessText, referenceScale } = request;
  const compute = (): Output => {
    H.domain(particleId.length > 0, "particleId");
    H.domain(suppliedRoundnessText.length > 0, "suppliedRoundnessText");
    H.domain(referenceScale.length > 0, "referenceScale");
    return {
      token: JSON.stringify([
        particleId,
        suppliedRoundnessText,
        referenceScale,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    particleId: "P17",
    suppliedRoundnessText: "subrounded",
    referenceScale: "scale S4",
  },
  output: { token: '["P17","subrounded","scale S4"]' },
} satisfies ToolExample<Input, Output>;
export const sedimentParticleRoundnessSourceRowTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/sediment-particle-roundness-source-row",
    title: "Sediment Particle Roundness Source Row Tool",
    description:
      "Preserve an explicit sediment particle roundness transcription and reference scale without image classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        particleId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedRoundnessText: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
        referenceScale: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["particleId", "suppliedRoundnessText", "referenceScale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "particleId",
          label: "Particle Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedRoundnessText",
          label: "Supplied Roundness Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceScale",
          label: "Reference Scale",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = sedimentParticleRoundnessSourceRowTool.execute;
export default sedimentParticleRoundnessSourceRowTool;
