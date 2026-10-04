import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemId: string;
  readonly code: string;
  readonly coderId: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemId: { type: "string", maxLength: 8192 },
    code: { type: "string", maxLength: 8192 },
    coderId: { type: "string", maxLength: 8192 },
  },
  required: ["itemId", "code", "coderId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Create an unambiguous item/code/coder annotation label from explicit cultural-content coding fields. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemId, code, coderId } = request;
  const compute = (): Output => {
    H.domain(
      itemId.length > 0 && code.length > 0 && coderId.length > 0,
      "itemId",
    );
    return { label: JSON.stringify([itemId, code, coderId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { itemId: "film-12", code: "R3", coderId: "coder-A" },
  output: { label: '["film-12","R3","coder-A"]' },
} satisfies ToolExample<Input, Output>;
export const representationCodedInstanceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-studies/representation-coded-instance-label",
    title: "Representation Coded Instance Label Tool",
    description:
      "Create an unambiguous item/code/coder annotation label from explicit cultural-content coding fields.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemId: { type: "string", maxLength: 8192 },
        code: { type: "string", maxLength: 8192 },
        coderId: { type: "string", maxLength: 8192 },
      },
      required: ["itemId", "code", "coderId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "itemId",
          label: "Item Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "code",
          label: "Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "coderId",
          label: "Coder Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = representationCodedInstanceLabelTool.execute;
export default representationCodedInstanceLabelTool;
