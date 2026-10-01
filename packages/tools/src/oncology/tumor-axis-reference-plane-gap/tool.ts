import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredAxis: number;
  readonly projectedAxis: number;
  readonly suppliedProjectionFactor: number;
};
export type Output = {
  readonly expectedProjection: number;
  readonly signedGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredAxis: { type: "number", minimum: 0 },
    projectedAxis: { type: "number", minimum: 0 },
    suppliedProjectionFactor: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["measuredAxis", "projectedAxis", "suppliedProjectionFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedProjection: { type: "number" },
    signedGap: { type: "number" },
  },
  required: ["expectedProjection", "signedGap"],
} as const;
/** Compare supplied image-axis measurements to an explicit projection factor, without response assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredAxis, projectedAxis, suppliedProjectionFactor } = request;
  const compute = (): Output => {
    H.domain(measuredAxis >= 0 && projectedAxis >= 0);
    H.probability(suppliedProjectionFactor);
    return {
      expectedProjection: measuredAxis * suppliedProjectionFactor,
      signedGap: projectedAxis - measuredAxis * suppliedProjectionFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredAxis: 10, projectedAxis: 7, suppliedProjectionFactor: 0.8 },
  output: { expectedProjection: 8, signedGap: -1 },
} satisfies ToolExample<Input, Output>;
export const tumorAxisReferencePlaneGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oncology/tumor-axis-reference-plane-gap",
    title: "Tumor Axis Reference Plane Gap Tool",
    description:
      "Compare supplied image-axis measurements to an explicit projection factor, without response assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredAxis: { type: "number", minimum: 0 },
        projectedAxis: { type: "number", minimum: 0 },
        suppliedProjectionFactor: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["measuredAxis", "projectedAxis", "suppliedProjectionFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedProjection: { type: "number" },
        signedGap: { type: "number" },
      },
      required: ["expectedProjection", "signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "measuredAxis",
          label: "Measured Axis",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "projectedAxis",
          label: "Projected Axis",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedProjectionFactor",
          label: "Supplied Projection Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedProjection",
          label: "Expected Projection",
          valueType: { type: "number" },
        },
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = tumorAxisReferencePlaneGapTool.execute;
export default tumorAxisReferencePlaneGapTool;
