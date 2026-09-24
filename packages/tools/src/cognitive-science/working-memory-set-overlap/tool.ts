import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly string[];
  readonly second: readonly string[];
};
export type Output = {
  readonly overlap: number;
  readonly firstOnly: number;
  readonly secondOnly: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    second: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlap: { type: "integer" },
    firstOnly: { type: "integer" },
    secondOnly: { type: "integer" },
  },
  required: ["overlap", "firstOnly", "secondOnly"],
} as const;
/** Calculate working memory set overlap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    return {
      overlap: new Set(first.filter((x) => second.includes(x))).size,
      firstOnly: new Set(first.filter((x) => !second.includes(x))).size,
      secondOnly: new Set(second.filter((x) => !first.includes(x))).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: ["a", "b"], second: ["b", "c"] },
  output: { overlap: 1, firstOnly: 1, secondOnly: 1 },
} satisfies ToolExample<Input, Output>;
export const workingMemorySetOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cognitive-science/working-memory-set-overlap",
    title: "Working Memory Set Overlap Tool",
    description:
      "Calculate working memory set overlap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        second: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlap: { type: "integer" },
        firstOnly: { type: "integer" },
        secondOnly: { type: "integer" },
      },
      required: ["overlap", "firstOnly", "secondOnly"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "overlap", label: "Overlap", valueType: { type: "integer" } },
        {
          id: "firstOnly",
          label: "First Only",
          valueType: { type: "integer" },
        },
        {
          id: "secondOnly",
          label: "Second Only",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = workingMemorySetOverlapTool.execute;
export default workingMemorySetOverlapTool;
