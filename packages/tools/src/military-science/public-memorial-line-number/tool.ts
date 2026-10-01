import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly blockIndex: number;
  readonly linesPerBlock: number;
  readonly lineWithinBlock: number;
  readonly origin: number;
};
export type Output = { readonly lineNumber: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    blockIndex: { type: "integer" },
    linesPerBlock: { type: "integer", minimum: 1 },
    lineWithinBlock: { type: "integer" },
    origin: { type: "integer" },
  },
  required: ["blockIndex", "linesPerBlock", "lineWithinBlock", "origin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lineNumber: { type: "integer" } },
  required: ["lineNumber"],
} as const;
/** Calculate public memorial line number from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { blockIndex, linesPerBlock, lineWithinBlock, origin } = request;
  const compute = (): Output => {
    H.domain(origin === 0 || origin === 1);
    H.integer(linesPerBlock, 1);
    H.integer(blockIndex, origin);
    H.integer(lineWithinBlock, origin, origin + linesPerBlock - 1);
    return {
      lineNumber: Number(
        BigInt(blockIndex - origin) * BigInt(linesPerBlock) +
          BigInt(lineWithinBlock),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { blockIndex: 2, linesPerBlock: 10, lineWithinBlock: 3, origin: 1 },
  output: { lineNumber: 13 },
} satisfies ToolExample<Input, Output>;
export const publicMemorialLineNumberTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "military-science/public-memorial-line-number",
    title: "Public Memorial Line Number Tool",
    description:
      "Calculate public memorial line number from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        blockIndex: { type: "integer" },
        linesPerBlock: { type: "integer", minimum: 1 },
        lineWithinBlock: { type: "integer" },
        origin: { type: "integer" },
      },
      required: ["blockIndex", "linesPerBlock", "lineWithinBlock", "origin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lineNumber: { type: "integer" } },
      required: ["lineNumber"],
    },
    ports: {
      inputs: [
        {
          id: "blockIndex",
          label: "Block Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "linesPerBlock",
          label: "Lines Per Block",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lineWithinBlock",
          label: "Line Within Block",
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
          id: "lineNumber",
          label: "Line Number",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicMemorialLineNumberTool.execute;
export default publicMemorialLineNumberTool;
