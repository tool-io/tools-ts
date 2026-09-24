import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parts: readonly number[];
  readonly caps: readonly number[];
};
export type Output = {
  readonly slacks: readonly number[];
  readonly feasible: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parts: { type: "array", maxItems: 256, items: { type: "integer" } },
    caps: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["parts", "caps"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slacks: { type: "array", maxItems: 256, items: { type: "integer" } },
    feasible: { type: "boolean" },
  },
  required: ["slacks", "feasible"],
} as const;
/** Calculate bounded composition cap slack from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { parts, caps } = input;
  const compute = (): Output => {
    H.sameLength(parts, caps);
    H.domain(parts.every((x) => x >= 0) && caps.every((x) => x >= 0));
    const slacks = caps.map((x, i) => x - parts[i]);
    return { slacks, feasible: slacks.every((x) => x >= 0) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { parts: [2, 4], caps: [3, 3] },
  output: { slacks: [1, -1], feasible: false },
} satisfies ToolExample<Input, Output>;
export const boundedCompositionCapSlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "combinatorics/bounded-composition-cap-slack",
    title: "Bounded Composition Cap Slack Tool",
    description:
      "Calculate bounded composition cap slack from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parts: { type: "array", maxItems: 256, items: { type: "integer" } },
        caps: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["parts", "caps"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slacks: { type: "array", maxItems: 256, items: { type: "integer" } },
        feasible: { type: "boolean" },
      },
      required: ["slacks", "feasible"],
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
          id: "caps",
          label: "Caps",
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
        { id: "feasible", label: "Feasible", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = boundedCompositionCapSlackTool.execute;
export default boundedCompositionCapSlackTool;
