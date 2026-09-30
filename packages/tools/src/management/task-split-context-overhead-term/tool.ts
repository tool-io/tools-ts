import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly productiveHours: number;
  readonly segments: number;
  readonly setupPerSegment: number;
  readonly switchCost: number;
};
export type Output = {
  readonly setupHours: number;
  readonly switchHours: number;
  readonly totalHours: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    productiveHours: { type: "number", minimum: 0 },
    segments: { type: "integer", minimum: 1 },
    setupPerSegment: { type: "number", minimum: 0 },
    switchCost: { type: "number", minimum: 0 },
  },
  required: ["productiveHours", "segments", "setupPerSegment", "switchCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    setupHours: { type: "number" },
    switchHours: { type: "number" },
    totalHours: { type: "number" },
  },
  required: ["setupHours", "switchHours", "totalHours"],
} as const;
/** Calculate task split context overhead term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { productiveHours, segments, setupPerSegment, switchCost } = request;
  const compute = (): Output => {
    H.integer(segments, 1);
    H.domain(productiveHours >= 0 && setupPerSegment >= 0 && switchCost >= 0);
    return {
      setupHours: segments * setupPerSegment,
      switchHours: (segments - 1) * switchCost,
      totalHours:
        productiveHours +
        segments * setupPerSegment +
        (segments - 1) * switchCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    productiveHours: 8,
    segments: 3,
    setupPerSegment: 0.5,
    switchCost: 0.25,
  },
  output: { setupHours: 1.5, switchHours: 0.5, totalHours: 10 },
} satisfies ToolExample<Input, Output>;
export const taskSplitContextOverheadTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/task-split-context-overhead-term",
    title: "Task Split Context Overhead Term Tool",
    description:
      "Calculate task split context overhead term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        productiveHours: { type: "number", minimum: 0 },
        segments: { type: "integer", minimum: 1 },
        setupPerSegment: { type: "number", minimum: 0 },
        switchCost: { type: "number", minimum: 0 },
      },
      required: [
        "productiveHours",
        "segments",
        "setupPerSegment",
        "switchCost",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        setupHours: { type: "number" },
        switchHours: { type: "number" },
        totalHours: { type: "number" },
      },
      required: ["setupHours", "switchHours", "totalHours"],
    },
    ports: {
      inputs: [
        {
          id: "productiveHours",
          label: "Productive Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "segments",
          label: "Segments",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "setupPerSegment",
          label: "Setup Per Segment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "switchCost",
          label: "Switch Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "setupHours",
          label: "Setup Hours",
          valueType: { type: "number" },
        },
        {
          id: "switchHours",
          label: "Switch Hours",
          valueType: { type: "number" },
        },
        {
          id: "totalHours",
          label: "Total Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = taskSplitContextOverheadTermTool.execute;
export default taskSplitContextOverheadTermTool;
