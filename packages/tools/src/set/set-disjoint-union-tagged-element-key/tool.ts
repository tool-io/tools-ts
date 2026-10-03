import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly tag: string; readonly elementJson: string };
export type Output = { readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tag: { type: "string", maxLength: 8192 },
    elementJson: { type: "string", maxLength: 8192 },
  },
  required: ["tag", "elementJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { key: { type: "string", maxLength: 8192 } },
  required: ["key"],
} as const;
/** Calculate set disjoint union tagged element key from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tag, elementJson } = request;
  const compute = (): Output => {
    const element = H.parseJson(elementJson);
    return { key: JSON.stringify([tag, element]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tag: "A", elementJson: '"x"' },
  output: { key: '["A","x"]' },
} satisfies ToolExample<Input, Output>;
export const setDisjointUnionTaggedElementKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/set-disjoint-union-tagged-element-key",
    title: "Set Disjoint Union Tagged Element Key Tool",
    description:
      "Calculate set disjoint union tagged element key from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tag: { type: "string", maxLength: 8192 },
        elementJson: { type: "string", maxLength: 8192 },
      },
      required: ["tag", "elementJson"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { key: { type: "string", maxLength: 8192 } },
      required: ["key"],
    },
    ports: {
      inputs: [
        {
          id: "tag",
          label: "Tag",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "elementJson",
          label: "Element Json",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "key", label: "Key", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = setDisjointUnionTaggedElementKeyTool.execute;
export default setDisjointUnionTaggedElementKeyTool;
