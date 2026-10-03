import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly length: number; readonly index: number };
export type Output = { readonly mirror: number; readonly fixed: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer", minimum: 1 },
    index: { type: "integer", minimum: 0 },
  },
  required: ["length", "index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { mirror: { type: "integer" }, fixed: { type: "boolean" } },
  required: ["mirror", "fixed"],
} as const;
/** Calculate sequence symmetric index pair map from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, index } = request;
  const compute = (): Output => {
    H.integer(length, 1);
    H.integer(index, 0, length - 1);
    const mirror = length - 1 - index;
    return { mirror, fixed: mirror === index };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 5, index: 1 },
  output: { mirror: 3, fixed: false },
} satisfies ToolExample<Input, Output>;
export const sequenceSymmetricIndexPairMapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/sequence-symmetric-index-pair-map",
    title: "Sequence Symmetric Index Pair Map Tool",
    description:
      "Calculate sequence symmetric index pair map from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer", minimum: 1 },
        index: { type: "integer", minimum: 0 },
      },
      required: ["length", "index"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { mirror: { type: "integer" }, fixed: { type: "boolean" } },
      required: ["mirror", "fixed"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "mirror", label: "Mirror", valueType: { type: "integer" } },
        { id: "fixed", label: "Fixed", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = sequenceSymmetricIndexPairMapTool.execute;
export default sequenceSymmetricIndexPairMapTool;
