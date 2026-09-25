import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly boolean[];
  readonly second: readonly boolean[];
};
export type Output = {
  readonly overlap: number;
  readonly union: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "array", maxItems: 256, items: { type: "boolean" } },
    second: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlap: { type: "integer" },
    union: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["overlap", "union", "share", "defined"],
} as const;
/** Compare supplied binary research annotations with intersection-over-union; no clinical plaque index. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    H.sameLength(first, second);
    return {
      overlap: first.filter((x, i) => x && second[i]).length,
      union: first.filter((x, i) => x || second[i]).length,
      share: first.some((x, i) => x || second[i])
        ? first.filter((x, i) => x && second[i]).length /
          first.filter((x, i) => x || second[i]).length
        : 0,
      defined: first.some((x, i) => x || second[i]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: [true, true, false], second: [false, true, true] },
  output: { overlap: 1, union: 3, share: 0.3333333333333333, defined: true },
} satisfies ToolExample<Input, Output>;
export const plaqueAnnotationOverlapShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dental-hygiene/plaque-annotation-overlap-share",
    title: "Plaque Annotation Overlap Share Tool",
    description:
      "Compare supplied binary research annotations with intersection-over-union; no clinical plaque index.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "array", maxItems: 256, items: { type: "boolean" } },
        second: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlap: { type: "integer" },
        union: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["overlap", "union", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "overlap", label: "Overlap", valueType: { type: "integer" } },
        { id: "union", label: "Union", valueType: { type: "integer" } },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = plaqueAnnotationOverlapShareTool.execute;
export default plaqueAnnotationOverlapShareTool;
