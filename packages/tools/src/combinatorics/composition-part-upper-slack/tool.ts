import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parts: readonly number[];
  readonly upperBounds: readonly number[];
};
export type Output = {
  readonly slacks: readonly number[];
  readonly exceedsAny: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parts: { type: "array", maxItems: 256, items: { type: "integer" } },
    upperBounds: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["parts", "upperBounds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slacks: { type: "array", maxItems: 256, items: { type: "integer" } },
    exceedsAny: { type: "boolean" },
  },
  required: ["slacks", "exceedsAny"],
} as const;
/** Calculate composition part upper slack from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parts, upperBounds } = request;
  const compute = (): Output => {
    H.sameLength(parts, upperBounds);
    H.domain([...parts, ...upperBounds].every((x) => x >= 0));
    return {
      slacks: upperBounds.map((x, i) => x - parts[i]),
      exceedsAny: parts.some((x, i) => x > upperBounds[i]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parts: [2, 5], upperBounds: [3, 4] },
  output: { slacks: [1, -1], exceedsAny: true },
} satisfies ToolExample<Input, Output>;
export const compositionPartUpperSlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "combinatorics/composition-part-upper-slack",
    title: "Composition Part Upper Slack Tool",
    description:
      "Calculate composition part upper slack from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parts: { type: "array", maxItems: 256, items: { type: "integer" } },
        upperBounds: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["parts", "upperBounds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slacks: { type: "array", maxItems: 256, items: { type: "integer" } },
        exceedsAny: { type: "boolean" },
      },
      required: ["slacks", "exceedsAny"],
    },
    ports: {
      inputs: [
        {
          id: "parts",
          label: "Parts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "upperBounds",
          label: "Upper Bounds",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "slacks",
          label: "Slacks",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "exceedsAny",
          label: "Exceeds Any",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = compositionPartUpperSlackTool.execute;
export default compositionPartUpperSlackTool;
