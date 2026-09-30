import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activePriorities: readonly number[];
  readonly candidatePriority: number;
  readonly depthLimit: number;
};
export type Output = {
  readonly wouldPreempt: boolean;
  readonly resultingDepth: number;
  readonly depthMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activePriorities: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    candidatePriority: { type: "integer", minimum: 0 },
    depthLimit: { type: "integer", minimum: 0 },
  },
  required: ["activePriorities", "candidatePriority", "depthLimit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wouldPreempt: { type: "boolean" },
    resultingDepth: { type: "integer" },
    depthMargin: { type: "integer" },
  },
  required: ["wouldPreempt", "resultingDepth", "depthMargin"],
} as const;
/** Compare a candidate against an explicitly ordered preemption stack where smaller priorities preempt larger ones. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activePriorities, candidatePriority, depthLimit } = request;
  const compute = (): Output => {
    H.integer(candidatePriority, 0);
    H.integer(depthLimit, 0);
    H.domain(
      activePriorities.every(
        (x, i) => x >= 0 && (i === 0 || x < activePriorities[i - 1]),
      ),
    );
    return (() => {
      const wouldPreempt =
          activePriorities.length === 0 ||
          candidatePriority < activePriorities[activePriorities.length - 1],
        resultingDepth = activePriorities.length + (wouldPreempt ? 1 : 0);
      return {
        wouldPreempt,
        resultingDepth,
        depthMargin: depthLimit - resultingDepth,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { activePriorities: [5, 3], candidatePriority: 1, depthLimit: 4 },
  output: { wouldPreempt: true, resultingDepth: 3, depthMargin: 1 },
} satisfies ToolExample<Input, Output>;
export const interruptNestingDepthMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/interrupt-nesting-depth-margin",
    title: "Interrupt Nesting Depth Margin Tool",
    description:
      "Compare a candidate against an explicitly ordered preemption stack where smaller priorities preempt larger ones.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activePriorities: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        candidatePriority: { type: "integer", minimum: 0 },
        depthLimit: { type: "integer", minimum: 0 },
      },
      required: ["activePriorities", "candidatePriority", "depthLimit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wouldPreempt: { type: "boolean" },
        resultingDepth: { type: "integer" },
        depthMargin: { type: "integer" },
      },
      required: ["wouldPreempt", "resultingDepth", "depthMargin"],
    },
    ports: {
      inputs: [
        {
          id: "activePriorities",
          label: "Active Priorities",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "candidatePriority",
          label: "Candidate Priority",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "depthLimit",
          label: "Depth Limit",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "wouldPreempt",
          label: "Would Preempt",
          valueType: { type: "boolean" },
        },
        {
          id: "resultingDepth",
          label: "Resulting Depth",
          valueType: { type: "integer" },
        },
        {
          id: "depthMargin",
          label: "Depth Margin",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = interruptNestingDepthMarginTool.execute;
export default interruptNestingDepthMarginTool;
