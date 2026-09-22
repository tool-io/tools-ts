import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstTop: number;
  readonly firstBottom: number;
  readonly secondTop: number;
  readonly secondBottom: number;
};
export type Output = {
  readonly overlapDepth: number;
  readonly unionDepth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTop: { type: "number" },
    firstBottom: { type: "number" },
    secondTop: { type: "number" },
    secondBottom: { type: "number" },
  },
  required: ["firstTop", "firstBottom", "secondTop", "secondBottom"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapDepth: { type: "number" },
    unionDepth: { type: "number" },
  },
  required: ["overlapDepth", "unionDepth"],
} as const;
/** Intersect supplied downward-positive depth intervals in one datum. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstTop, firstBottom, secondTop, secondBottom } = request;
  const compute = (): Output => {
    H.domain(firstTop <= firstBottom && secondTop <= secondBottom);
    return {
      overlapDepth: Math.max(
        0,
        Math.min(firstBottom, secondBottom) - Math.max(firstTop, secondTop),
      ),
      unionDepth:
        firstBottom -
        firstTop +
        secondBottom -
        secondTop -
        Math.max(
          0,
          Math.min(firstBottom, secondBottom) - Math.max(firstTop, secondTop),
        ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstTop: 0, firstBottom: 10, secondTop: 5, secondBottom: 15 },
  output: { overlapDepth: 5, unionDepth: 15 },
} satisfies ToolExample<Input, Output>;
export const waterColumnLayerOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquatic-science/water-column-layer-overlap",
    title: "Water Column Layer Overlap Tool",
    description:
      "Intersect supplied downward-positive depth intervals in one datum.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstTop: { type: "number" },
        firstBottom: { type: "number" },
        secondTop: { type: "number" },
        secondBottom: { type: "number" },
      },
      required: ["firstTop", "firstBottom", "secondTop", "secondBottom"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlapDepth: { type: "number" },
        unionDepth: { type: "number" },
      },
      required: ["overlapDepth", "unionDepth"],
    },
    ports: {
      inputs: [
        {
          id: "firstTop",
          label: "First Top",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstBottom",
          label: "First Bottom",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondTop",
          label: "Second Top",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondBottom",
          label: "Second Bottom",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "overlapDepth",
          label: "Overlap Depth",
          valueType: { type: "number" },
        },
        {
          id: "unionDepth",
          label: "Union Depth",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = waterColumnLayerOverlapTool.execute;
export default waterColumnLayerOverlapTool;
