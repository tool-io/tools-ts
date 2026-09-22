import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly position: number; readonly authorCount: number };
export type Output = { readonly positionShare: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    position: { type: "integer", minimum: 1 },
    authorCount: { type: "integer", minimum: 1 },
  },
  required: ["position", "authorCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { positionShare: { type: "number" } },
  required: ["positionShare"],
} as const;
/** Normalize one supplied one-based author position; position does not imply contribution credit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { position, authorCount } = request;
  const compute = (): Output => {
    H.integer(authorCount, 1);
    H.integer(position, 1, authorCount);
    return { positionShare: position / authorCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { position: 2, authorCount: 4 },
  output: { positionShare: 0.5 },
} satisfies ToolExample<Input, Output>;
export const authorPositionNormalizedShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bibliometrics/author-position-normalized-share",
    title: "Author Position Normalized Share Tool",
    description:
      "Normalize one supplied one-based author position; position does not imply contribution credit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        position: { type: "integer", minimum: 1 },
        authorCount: { type: "integer", minimum: 1 },
      },
      required: ["position", "authorCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { positionShare: { type: "number" } },
      required: ["positionShare"],
    },
    ports: {
      inputs: [
        {
          id: "position",
          label: "Position",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "authorCount",
          label: "Author Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "positionShare",
          label: "Position Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = authorPositionNormalizedShareTool.execute;
export default authorPositionNormalizedShareTool;
