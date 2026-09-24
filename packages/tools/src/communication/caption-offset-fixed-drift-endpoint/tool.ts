import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceSeconds: number;
  readonly fixedOffset: number;
  readonly driftPerSecond: number;
};
export type Output = {
  readonly correctedSeconds: number;
  readonly appliedOffset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceSeconds: { type: "number", minimum: 0 },
    fixedOffset: { type: "number" },
    driftPerSecond: { type: "number" },
  },
  required: ["sourceSeconds", "fixedOffset", "driftPerSecond"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedSeconds: { type: "number" },
    appliedOffset: { type: "number" },
  },
  required: ["correctedSeconds", "appliedOffset"],
} as const;
/** Calculate caption offset fixed drift endpoint from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceSeconds, fixedOffset, driftPerSecond } = request;
  const compute = (): Output => {
    H.domain(sourceSeconds >= 0);
    const appliedOffset = fixedOffset + sourceSeconds * driftPerSecond;
    return {
      correctedSeconds: sourceSeconds + appliedOffset,
      appliedOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceSeconds: 100, fixedOffset: 2, driftPerSecond: 0.01 },
  output: { correctedSeconds: 103, appliedOffset: 3 },
} satisfies ToolExample<Input, Output>;
export const captionOffsetFixedDriftEndpointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/caption-offset-fixed-drift-endpoint",
    title: "Caption Offset Fixed Drift Endpoint Tool",
    description:
      "Calculate caption offset fixed drift endpoint from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceSeconds: { type: "number", minimum: 0 },
        fixedOffset: { type: "number" },
        driftPerSecond: { type: "number" },
      },
      required: ["sourceSeconds", "fixedOffset", "driftPerSecond"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedSeconds: { type: "number" },
        appliedOffset: { type: "number" },
      },
      required: ["correctedSeconds", "appliedOffset"],
    },
    ports: {
      inputs: [
        {
          id: "sourceSeconds",
          label: "Source Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedOffset",
          label: "Fixed Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "driftPerSecond",
          label: "Drift Per Second",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedSeconds",
          label: "Corrected Seconds",
          valueType: { type: "number" },
        },
        {
          id: "appliedOffset",
          label: "Applied Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = captionOffsetFixedDriftEndpointTool.execute;
export default captionOffsetFixedDriftEndpointTool;
