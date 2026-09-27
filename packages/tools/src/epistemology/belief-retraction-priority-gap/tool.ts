import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beliefPriorities: readonly number[];
  readonly retracted: readonly boolean[];
  readonly lowerIsEarlier: boolean;
};
export type Output = {
  readonly firstRetractionIndex: number;
  readonly priority: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beliefPriorities: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    retracted: { type: "array", maxItems: 256, items: { type: "boolean" } },
    lowerIsEarlier: { type: "boolean" },
  },
  required: ["beliefPriorities", "retracted", "lowerIsEarlier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstRetractionIndex: { type: "integer" },
    priority: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["firstRetractionIndex", "priority", "defined"],
} as const;
/** Select an explicitly marked retraction by supplied priority, with stable first-index ties. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beliefPriorities, retracted, lowerIsEarlier } = request;
  const compute = (): Output => {
    H.sameLength(beliefPriorities, retracted);
    return (() => {
      let firstRetractionIndex = -1;
      beliefPriorities.forEach((x, i) => {
        if (
          retracted[i] &&
          (firstRetractionIndex < 0 ||
            (lowerIsEarlier
              ? x < beliefPriorities[firstRetractionIndex]
              : x > beliefPriorities[firstRetractionIndex]))
        )
          firstRetractionIndex = i;
      });
      return {
        firstRetractionIndex,
        priority:
          firstRetractionIndex < 0 ? 0 : beliefPriorities[firstRetractionIndex],
        defined: firstRetractionIndex >= 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    beliefPriorities: [3, 1, 2],
    retracted: [true, true, false],
    lowerIsEarlier: true,
  },
  output: { firstRetractionIndex: 1, priority: 1, defined: true },
} satisfies ToolExample<Input, Output>;
export const beliefRetractionPriorityGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epistemology/belief-retraction-priority-gap",
    title: "Belief Retraction Priority Gap Tool",
    description:
      "Select an explicitly marked retraction by supplied priority, with stable first-index ties.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beliefPriorities: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        retracted: { type: "array", maxItems: 256, items: { type: "boolean" } },
        lowerIsEarlier: { type: "boolean" },
      },
      required: ["beliefPriorities", "retracted", "lowerIsEarlier"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstRetractionIndex: { type: "integer" },
        priority: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["firstRetractionIndex", "priority", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "beliefPriorities",
          label: "Belief Priorities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "retracted",
          label: "Retracted",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "lowerIsEarlier",
          label: "Lower Is Earlier",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "firstRetractionIndex",
          label: "First Retraction Index",
          valueType: { type: "integer" },
        },
        { id: "priority", label: "Priority", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = beliefRetractionPriorityGapTool.execute;
export default beliefRetractionPriorityGapTool;
