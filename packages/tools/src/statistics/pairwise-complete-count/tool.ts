import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstObserved: readonly boolean[];
  readonly secondObserved: readonly boolean[];
};
export type Output = { readonly jointlyObserved: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstObserved: { type: "array", maxItems: 256, items: { type: "boolean" } },
    secondObserved: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["firstObserved", "secondObserved"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { jointlyObserved: { type: "integer" } },
  required: ["jointlyObserved"],
} as const;
/** Count jointly observed rows for one supplied variable pair without imputing missing values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstObserved, secondObserved } = request;
  const compute = (): Output => {
    H.sameLength(firstObserved, secondObserved);
    return {
      jointlyObserved: firstObserved.filter((x, i) => x && secondObserved[i])
        .length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstObserved: [true, true, false],
    secondObserved: [true, false, true],
  },
  output: { jointlyObserved: 1 },
} satisfies ToolExample<Input, Output>;
export const pairwiseCompleteCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/pairwise-complete-count",
    title: "Pairwise Complete Count Tool",
    description:
      "Count jointly observed rows for one supplied variable pair without imputing missing values.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstObserved: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        secondObserved: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["firstObserved", "secondObserved"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { jointlyObserved: { type: "integer" } },
      required: ["jointlyObserved"],
    },
    ports: {
      inputs: [
        {
          id: "firstObserved",
          label: "First Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "secondObserved",
          label: "Second Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "jointlyObserved",
          label: "Jointly Observed",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = pairwiseCompleteCountTool.execute;
export default pairwiseCompleteCountTool;
