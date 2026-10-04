import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly start: readonly number[];
  readonly end: readonly number[];
  readonly origin: readonly number[];
};
export type Output = {
  readonly direction: readonly number[];
  readonly shiftedDirection: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "array", maxItems: 256, items: { type: "number" } },
    end: { type: "array", maxItems: 256, items: { type: "number" } },
    origin: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["start", "end", "origin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    direction: { type: "array", maxItems: 256, items: { type: "number" } },
    shiftedDirection: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["direction", "shiftedDirection"],
} as const;
/** Calculate vector origin change direction invariance from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { start, end, origin } = input;
  const compute = (): Output => {
    H.sameLength(start, end);
    H.sameLength(start, origin);
    return {
      direction: end.map((x, i) => x - start[i]),
      shiftedDirection: end.map(
        (x, i) => x - origin[i] - (start[i] - origin[i]),
      ),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { start: [1, 2], end: [4, 6], origin: [10, 20] },
  output: { direction: [3, 4], shiftedDirection: [3, 4] },
} satisfies ToolExample<Input, Output>;
export const vectorOriginChangeDirectionInvarianceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "vector/vector-origin-change-direction-invariance",
      title: "Vector Origin Change Direction Invariance Tool",
      description:
        "Calculate vector origin change direction invariance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          start: { type: "array", maxItems: 256, items: { type: "number" } },
          end: { type: "array", maxItems: 256, items: { type: "number" } },
          origin: { type: "array", maxItems: 256, items: { type: "number" } },
        },
        required: ["start", "end", "origin"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          direction: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          shiftedDirection: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["direction", "shiftedDirection"],
      },
      ports: {
        inputs: [
          {
            id: "start",
            label: "Start",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "end",
            label: "End",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "origin",
            label: "Origin",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "direction",
            label: "Direction",
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "shiftedDirection",
            label: "Shifted Direction",
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = vectorOriginChangeDirectionInvarianceTool.execute;
export default vectorOriginChangeDirectionInvarianceTool;
