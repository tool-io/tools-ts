import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly targetRecoveryHours: number;
  readonly measuredRecoveryHours: number;
};
export type Output = {
  readonly gapHours: number;
  readonly meetsSuppliedTarget: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetRecoveryHours: { type: "number", minimum: 0 },
    measuredRecoveryHours: { type: "number", minimum: 0 },
  },
  required: ["targetRecoveryHours", "measuredRecoveryHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gapHours: { type: "number" },
    meetsSuppliedTarget: { type: "boolean" },
  },
  required: ["gapHours", "meetsSuppliedTarget"],
} as const;
/** Compare a recorded continuity-task recovery duration with an explicit target without executing recovery actions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { targetRecoveryHours, measuredRecoveryHours } = request;
  const compute = (): Output => {
    H.domain(
      targetRecoveryHours >= 0 && measuredRecoveryHours >= 0,
      "targetRecoveryHours",
    );
    return {
      gapHours: measuredRecoveryHours - targetRecoveryHours,
      meetsSuppliedTarget: measuredRecoveryHours <= targetRecoveryHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { targetRecoveryHours: 4, measuredRecoveryHours: 3 },
  output: { gapHours: -1, meetsSuppliedTarget: true },
} satisfies ToolExample<Input, Output>;
export const continuityTaskRecoveryGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "security-studies/continuity-task-recovery-gap",
    title: "Continuity Task Recovery Gap Tool",
    description:
      "Compare a recorded continuity-task recovery duration with an explicit target without executing recovery actions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetRecoveryHours: { type: "number", minimum: 0 },
        measuredRecoveryHours: { type: "number", minimum: 0 },
      },
      required: ["targetRecoveryHours", "measuredRecoveryHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gapHours: { type: "number" },
        meetsSuppliedTarget: { type: "boolean" },
      },
      required: ["gapHours", "meetsSuppliedTarget"],
    },
    ports: {
      inputs: [
        {
          id: "targetRecoveryHours",
          label: "Target Recovery Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredRecoveryHours",
          label: "Measured Recovery Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gapHours", label: "Gap Hours", valueType: { type: "number" } },
        {
          id: "meetsSuppliedTarget",
          label: "Meets Supplied Target",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = continuityTaskRecoveryGapTool.execute;
export default continuityTaskRecoveryGapTool;
