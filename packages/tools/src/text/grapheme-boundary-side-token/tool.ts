import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly offset: number;
  readonly boundaries: readonly number[];
};
export type Output = {
  readonly atBoundary: boolean;
  readonly leftBoundary: number;
  readonly rightBoundary: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offset: { type: "integer", minimum: 0 },
    boundaries: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["offset", "boundaries"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    atBoundary: { type: "boolean" },
    leftBoundary: { type: "integer" },
    rightBoundary: { type: "integer" },
  },
  required: ["atBoundary", "leftBoundary", "rightBoundary"],
} as const;
/** Locate an offset relative to caller-supplied grapheme boundaries; no Unicode segmentation is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { offset, boundaries } = request;
  const compute = (): Output => {
    H.domain(
      boundaries.length > 0 &&
        boundaries[0] === 0 &&
        boundaries.every(
          (x, i) => x >= 0 && (i === 0 || x > boundaries[i - 1]),
        ),
    );
    H.integer(offset, 0, boundaries[boundaries.length - 1]);
    return {
      atBoundary: boundaries.includes(offset),
      leftBoundary: Math.max(...boundaries.filter((x) => x <= offset)),
      rightBoundary: Math.min(...boundaries.filter((x) => x >= offset)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { offset: 2, boundaries: [0, 1, 3, 5] },
  output: { atBoundary: false, leftBoundary: 1, rightBoundary: 3 },
} satisfies ToolExample<Input, Output>;
export const graphemeBoundarySideTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/grapheme-boundary-side-token",
    title: "Grapheme Boundary Side Token Tool",
    description:
      "Locate an offset relative to caller-supplied grapheme boundaries; no Unicode segmentation is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        offset: { type: "integer", minimum: 0 },
        boundaries: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["offset", "boundaries"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        atBoundary: { type: "boolean" },
        leftBoundary: { type: "integer" },
        rightBoundary: { type: "integer" },
      },
      required: ["atBoundary", "leftBoundary", "rightBoundary"],
    },
    ports: {
      inputs: [
        {
          id: "offset",
          label: "Offset",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "boundaries",
          label: "Boundaries",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "atBoundary",
          label: "At Boundary",
          valueType: { type: "boolean" },
        },
        {
          id: "leftBoundary",
          label: "Left Boundary",
          valueType: { type: "integer" },
        },
        {
          id: "rightBoundary",
          label: "Right Boundary",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = graphemeBoundarySideTokenTool.execute;
export default graphemeBoundarySideTokenTool;
