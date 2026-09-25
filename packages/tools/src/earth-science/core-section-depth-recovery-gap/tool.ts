import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly topDepth: number;
  readonly bottomDepth: number;
  readonly recoveredLength: number;
};
export type Output = {
  readonly drilledLength: number;
  readonly unrecoveredLength: number;
  readonly recoveryFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    topDepth: { type: "number" },
    bottomDepth: { type: "number" },
    recoveredLength: { type: "number", minimum: 0 },
  },
  required: ["topDepth", "bottomDepth", "recoveredLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    drilledLength: { type: "number" },
    unrecoveredLength: { type: "number" },
    recoveryFraction: { type: "number" },
  },
  required: ["drilledLength", "unrecoveredLength", "recoveryFraction"],
} as const;
/** Compare supplied core recovery length with a drilled interval, allowing recovery over 100% to remain visible. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { topDepth, bottomDepth, recoveredLength } = request;
  const compute = (): Output => {
    H.domain(bottomDepth > topDepth && recoveredLength >= 0);
    return {
      drilledLength: bottomDepth - topDepth,
      unrecoveredLength: bottomDepth - topDepth - recoveredLength,
      recoveryFraction: recoveredLength / (bottomDepth - topDepth),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { topDepth: 10, bottomDepth: 15, recoveredLength: 4 },
  output: { drilledLength: 5, unrecoveredLength: 1, recoveryFraction: 0.8 },
} satisfies ToolExample<Input, Output>;
export const coreSectionDepthRecoveryGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "earth-science/core-section-depth-recovery-gap",
    title: "Core Section Depth Recovery Gap Tool",
    description:
      "Compare supplied core recovery length with a drilled interval, allowing recovery over 100% to remain visible.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        topDepth: { type: "number" },
        bottomDepth: { type: "number" },
        recoveredLength: { type: "number", minimum: 0 },
      },
      required: ["topDepth", "bottomDepth", "recoveredLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        drilledLength: { type: "number" },
        unrecoveredLength: { type: "number" },
        recoveryFraction: { type: "number" },
      },
      required: ["drilledLength", "unrecoveredLength", "recoveryFraction"],
    },
    ports: {
      inputs: [
        {
          id: "topDepth",
          label: "Top Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bottomDepth",
          label: "Bottom Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recoveredLength",
          label: "Recovered Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "drilledLength",
          label: "Drilled Length",
          valueType: { type: "number" },
        },
        {
          id: "unrecoveredLength",
          label: "Unrecovered Length",
          valueType: { type: "number" },
        },
        {
          id: "recoveryFraction",
          label: "Recovery Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = coreSectionDepthRecoveryGapTool.execute;
export default coreSectionDepthRecoveryGapTool;
