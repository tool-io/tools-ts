import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalMinutes: number;
  readonly demonstration: number;
  readonly cleanup: number;
  readonly transition: number;
};
export type Output = {
  readonly practiceMinutes: number;
  readonly cleanupShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalMinutes: { type: "number", exclusiveMinimum: 0 },
    demonstration: { type: "number", minimum: 0 },
    cleanup: { type: "number", minimum: 0 },
    transition: { type: "number", minimum: 0 },
  },
  required: ["totalMinutes", "demonstration", "cleanup", "transition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    practiceMinutes: { type: "number" },
    cleanupShare: { type: "number" },
  },
  required: ["practiceMinutes", "cleanupShare"],
} as const;
/** Calculate art class cleanup instruction time split from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalMinutes, demonstration, cleanup, transition } = request;
  const compute = (): Output => {
    H.positive(totalMinutes);
    H.domain(
      demonstration >= 0 &&
        cleanup >= 0 &&
        transition >= 0 &&
        totalMinutes >= demonstration + cleanup + transition,
    );
    return {
      practiceMinutes: totalMinutes - demonstration - cleanup - transition,
      cleanupShare: cleanup / totalMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalMinutes: 90, demonstration: 15, cleanup: 10, transition: 5 },
  output: { practiceMinutes: 60, cleanupShare: 0.1111111111111111 },
} satisfies ToolExample<Input, Output>;
export const artClassCleanupInstructionTimeSplitTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "art-education/art-class-cleanup-instruction-time-split",
      title: "Art Class Cleanup Instruction Time Split Tool",
      description:
        "Calculate art class cleanup instruction time split from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalMinutes: { type: "number", exclusiveMinimum: 0 },
          demonstration: { type: "number", minimum: 0 },
          cleanup: { type: "number", minimum: 0 },
          transition: { type: "number", minimum: 0 },
        },
        required: ["totalMinutes", "demonstration", "cleanup", "transition"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          practiceMinutes: { type: "number" },
          cleanupShare: { type: "number" },
        },
        required: ["practiceMinutes", "cleanupShare"],
      },
      ports: {
        inputs: [
          {
            id: "totalMinutes",
            label: "Total Minutes",
            required: true,
            valueType: { type: "number", unit: "min" },
          },
          {
            id: "demonstration",
            label: "Demonstration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "cleanup",
            label: "Cleanup",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "transition",
            label: "Transition",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "practiceMinutes",
            label: "Practice Minutes",
            valueType: { type: "number", unit: "min" },
          },
          {
            id: "cleanupShare",
            label: "Cleanup Share",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = artClassCleanupInstructionTimeSplitTool.execute;
export default artClassCleanupInstructionTimeSplitTool;
