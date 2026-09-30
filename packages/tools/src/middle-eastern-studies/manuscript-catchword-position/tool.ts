import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leaf: number;
  readonly line: number;
  readonly linesOnLeaf: number;
  readonly origin: number;
};
export type Output = {
  readonly distanceFromFinalLine: number;
  readonly finalLine: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leaf: { type: "integer", minimum: 1 },
    line: { type: "integer" },
    linesOnLeaf: { type: "integer", minimum: 1 },
    origin: { type: "integer" },
  },
  required: ["leaf", "line", "linesOnLeaf", "origin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distanceFromFinalLine: { type: "integer" },
    finalLine: { type: "boolean" },
  },
  required: ["distanceFromFinalLine", "finalLine"],
} as const;
/** Locate a supplied catchword line within one leaf; the leaf number is preserved as input context. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leaf, line, linesOnLeaf, origin } = request;
  const compute = (): Output => {
    H.integer(leaf, 1);
    H.domain(origin === 0 || origin === 1);
    H.integer(linesOnLeaf, 1);
    H.integer(line, origin, origin + linesOnLeaf - 1);
    return {
      distanceFromFinalLine: origin + linesOnLeaf - 1 - line,
      finalLine: line === origin + linesOnLeaf - 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leaf: 12, line: 20, linesOnLeaf: 20, origin: 1 },
  output: { distanceFromFinalLine: 0, finalLine: true },
} satisfies ToolExample<Input, Output>;
export const manuscriptCatchwordPositionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "middle-eastern-studies/manuscript-catchword-position",
    title: "Manuscript Catchword Position Tool",
    description:
      "Locate a supplied catchword line within one leaf; the leaf number is preserved as input context.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leaf: { type: "integer", minimum: 1 },
        line: { type: "integer" },
        linesOnLeaf: { type: "integer", minimum: 1 },
        origin: { type: "integer" },
      },
      required: ["leaf", "line", "linesOnLeaf", "origin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distanceFromFinalLine: { type: "integer" },
        finalLine: { type: "boolean" },
      },
      required: ["distanceFromFinalLine", "finalLine"],
    },
    ports: {
      inputs: [
        {
          id: "leaf",
          label: "Leaf",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "line",
          label: "Line",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "linesOnLeaf",
          label: "Lines On Leaf",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "distanceFromFinalLine",
          label: "Distance From Final Line",
          valueType: { type: "integer" },
        },
        {
          id: "finalLine",
          label: "Final Line",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = manuscriptCatchwordPositionTool.execute;
export default manuscriptCatchwordPositionTool;
