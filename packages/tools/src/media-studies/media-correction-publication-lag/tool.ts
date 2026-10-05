import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalTimestampSeconds: number;
  readonly correctionTimestampSeconds: number;
};
export type Output = { readonly lagSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalTimestampSeconds: { type: "number" },
    correctionTimestampSeconds: { type: "number" },
  },
  required: ["originalTimestampSeconds", "correctionTimestampSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lagSeconds: { type: "number" } },
  required: ["lagSeconds"],
} as const;
/** Measure elapsed seconds from an original publication to a recorded correction on a shared timestamp scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalTimestampSeconds, correctionTimestampSeconds } = request;
  const compute = (): Output => {
    H.domain(
      correctionTimestampSeconds >= originalTimestampSeconds,
      "correctionTimestampSeconds",
    );
    return {
      lagSeconds: correctionTimestampSeconds - originalTimestampSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { originalTimestampSeconds: 100, correctionTimestampSeconds: 460 },
  output: { lagSeconds: 360 },
} satisfies ToolExample<Input, Output>;
export const mediaCorrectionPublicationLagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "media-studies/media-correction-publication-lag",
    title: "Media Correction Publication Lag Tool",
    description:
      "Measure elapsed seconds from an original publication to a recorded correction on a shared timestamp scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalTimestampSeconds: { type: "number" },
        correctionTimestampSeconds: { type: "number" },
      },
      required: ["originalTimestampSeconds", "correctionTimestampSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lagSeconds: { type: "number" } },
      required: ["lagSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "originalTimestampSeconds",
          label: "Original Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "correctionTimestampSeconds",
          label: "Correction Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lagSeconds",
          label: "Lag Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mediaCorrectionPublicationLagTool.execute;
export default mediaCorrectionPublicationLagTool;
