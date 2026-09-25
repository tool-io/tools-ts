import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parentEnd: number;
  readonly childStart: number;
  readonly childEnd: number;
  readonly parentRestart: number;
};
export type Output = {
  readonly childResponseGap: number;
  readonly parentResponseGap: number;
  readonly totalGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentEnd: { type: "number" },
    childStart: { type: "number" },
    childEnd: { type: "number" },
    parentRestart: { type: "number" },
  },
  required: ["parentEnd", "childStart", "childEnd", "parentRestart"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    childResponseGap: { type: "number" },
    parentResponseGap: { type: "number" },
    totalGap: { type: "number" },
  },
  required: ["childResponseGap", "parentResponseGap", "totalGap"],
} as const;
/** Signed gaps preserve overlapping turns; caller event coding is accepted without conversational or clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parentEnd, childStart, childEnd, parentRestart } = request;
  const compute = (): Output => {
    H.domain(childEnd >= childStart);
    return {
      childResponseGap: childStart - parentEnd,
      parentResponseGap: parentRestart - childEnd,
      totalGap: childStart - parentEnd + parentRestart - childEnd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parentEnd: 10, childStart: 11, childEnd: 13, parentRestart: 14 },
  output: { childResponseGap: 1, parentResponseGap: 1, totalGap: 2 },
} satisfies ToolExample<Input, Output>;
export const parentChildTurnTakingOneIntervalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/parent-child-turn-taking-one-interval",
    title: "Parent Child Turn Taking One Interval Tool",
    description:
      "Signed gaps preserve overlapping turns; caller event coding is accepted without conversational or clinical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentEnd: { type: "number" },
        childStart: { type: "number" },
        childEnd: { type: "number" },
        parentRestart: { type: "number" },
      },
      required: ["parentEnd", "childStart", "childEnd", "parentRestart"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        childResponseGap: { type: "number" },
        parentResponseGap: { type: "number" },
        totalGap: { type: "number" },
      },
      required: ["childResponseGap", "parentResponseGap", "totalGap"],
    },
    ports: {
      inputs: [
        {
          id: "parentEnd",
          label: "Parent End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "childStart",
          label: "Child Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "childEnd",
          label: "Child End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "parentRestart",
          label: "Parent Restart",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "childResponseGap",
          label: "Child Response Gap",
          valueType: { type: "number" },
        },
        {
          id: "parentResponseGap",
          label: "Parent Response Gap",
          valueType: { type: "number" },
        },
        { id: "totalGap", label: "Total Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = parentChildTurnTakingOneIntervalTool.execute;
export default parentChildTurnTakingOneIntervalTool;
