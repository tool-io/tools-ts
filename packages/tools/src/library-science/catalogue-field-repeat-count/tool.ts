import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tags: readonly string[];
  readonly requestedTag: string;
};
export type Output = {
  readonly occurrences: number;
  readonly repeatsBeyondFirst: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tags: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requestedTag: { type: "string", maxLength: 8192 },
  },
  required: ["tags", "requestedTag"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occurrences: { type: "integer" },
    repeatsBeyondFirst: { type: "integer" },
  },
  required: ["occurrences", "repeatsBeyondFirst"],
} as const;
/** Calculate catalogue field repeat count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tags, requestedTag } = request;
  const compute = (): Output => {
    return {
      occurrences: tags.filter((x) => x === requestedTag).length,
      repeatsBeyondFirst: Math.max(
        0,
        tags.filter((x) => x === requestedTag).length - 1,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tags: ["650", "245", "650"], requestedTag: "650" },
  output: { occurrences: 2, repeatsBeyondFirst: 1 },
} satisfies ToolExample<Input, Output>;
export const catalogueFieldRepeatCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/catalogue-field-repeat-count",
    title: "Catalogue Field Repeat Count Tool",
    description:
      "Calculate catalogue field repeat count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tags: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requestedTag: { type: "string", maxLength: 8192 },
      },
      required: ["tags", "requestedTag"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occurrences: { type: "integer" },
        repeatsBeyondFirst: { type: "integer" },
      },
      required: ["occurrences", "repeatsBeyondFirst"],
    },
    ports: {
      inputs: [
        {
          id: "tags",
          label: "Tags",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requestedTag",
          label: "Requested Tag",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "occurrences",
          label: "Occurrences",
          valueType: { type: "integer" },
        },
        {
          id: "repeatsBeyondFirst",
          label: "Repeats Beyond First",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = catalogueFieldRepeatCountTool.execute;
export default catalogueFieldRepeatCountTool;
