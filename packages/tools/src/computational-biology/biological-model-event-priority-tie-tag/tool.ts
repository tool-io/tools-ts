import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPriority: number;
  readonly secondPriority: number;
};
export type Output = {
  readonly tied: boolean;
  readonly higherPriority: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPriority: { type: "number" },
    secondPriority: { type: "number" },
  },
  required: ["firstPriority", "secondPriority"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tied: { type: "boolean" },
    higherPriority: { type: "string", maxLength: 8192 },
  },
  required: ["tied", "higherPriority"],
} as const;
/** Compare explicit model event priorities using a supplied higher-number-first convention without scheduling events. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPriority, secondPriority } = request;
  const compute = (): Output => {
    return {
      tied: firstPriority === secondPriority,
      higherPriority:
        firstPriority > secondPriority
          ? "first"
          : firstPriority < secondPriority
            ? "second"
            : "tie",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstPriority: 4, secondPriority: 2 },
  output: { tied: false, higherPriority: "first" },
} satisfies ToolExample<Input, Output>;
export const biologicalModelEventPriorityTieTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["computational-biology", "computational biology", "biology"],
      keywords: ["computational biology", "biology"],
    },
    id: "computational-biology/biological-model-event-priority-tie-tag",
    title: "Biological Model Event Priority Tie Tag",
    description:
      "Compare explicit model event priorities using a supplied higher-number-first convention without scheduling events.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPriority: { type: "number" },
        secondPriority: { type: "number" },
      },
      required: ["firstPriority", "secondPriority"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tied: { type: "boolean" },
        higherPriority: { type: "string", maxLength: 8192 },
      },
      required: ["tied", "higherPriority"],
    },
    ports: {
      inputs: [
        {
          id: "firstPriority",
          label: "First Priority",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondPriority",
          label: "Second Priority",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "tied", label: "Tied", valueType: { type: "boolean" } },
        {
          id: "higherPriority",
          label: "Higher Priority",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = biologicalModelEventPriorityTieTagTool.execute;
export default biologicalModelEventPriorityTieTagTool;
