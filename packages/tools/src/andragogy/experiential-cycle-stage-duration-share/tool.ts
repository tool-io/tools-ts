import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stageMinutes: readonly number[];
  readonly stage: number;
};
export type Output = {
  readonly totalMinutes: number;
  readonly stageShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stageMinutes: { type: "array", maxItems: 256, items: { type: "number" } },
    stage: { type: "integer", minimum: 0 },
  },
  required: ["stageMinutes", "stage"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalMinutes: { type: "number" },
    stageShare: { type: "number" },
  },
  required: ["totalMinutes", "stageShare"],
} as const;
/** Calculate experiential cycle stage duration share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stageMinutes, stage } = request;
  const compute = (): Output => {
    H.domain(
      stageMinutes.every((x) => x >= 0) && stageMinutes.some((x) => x > 0),
    );
    H.integer(stage, 0, stageMinutes.length - 1);
    return {
      totalMinutes: stageMinutes.reduce((a, b) => a + b, 0),
      stageShare: stageMinutes[stage] / stageMinutes.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stageMinutes: [20, 10, 10, 40], stage: 0 },
  output: { totalMinutes: 80, stageShare: 0.25 },
} satisfies ToolExample<Input, Output>;
export const experientialCycleStageDurationShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "andragogy/experiential-cycle-stage-duration-share",
      title: "Experiential Cycle Stage Duration Share Tool",
      description:
        "Calculate experiential cycle stage duration share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          stageMinutes: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          stage: { type: "integer", minimum: 0 },
        },
        required: ["stageMinutes", "stage"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalMinutes: { type: "number" },
          stageShare: { type: "number" },
        },
        required: ["totalMinutes", "stageShare"],
      },
      ports: {
        inputs: [
          {
            id: "stageMinutes",
            label: "Stage Minutes",
            required: true,
            valueType: { type: "list", items: { type: "number" }, unit: "min" },
          },
          {
            id: "stage",
            label: "Stage",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "totalMinutes",
            label: "Total Minutes",
            valueType: { type: "number", unit: "min" },
          },
          {
            id: "stageShare",
            label: "Stage Share",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = experientialCycleStageDurationShareTool.execute;
export default experientialCycleStageDurationShareTool;
