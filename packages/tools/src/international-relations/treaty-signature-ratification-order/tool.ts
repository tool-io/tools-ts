import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signatureCoordinate: number;
  readonly ratificationCoordinate: number;
};
export type Output = { readonly elapsed: number; readonly inOrder: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signatureCoordinate: { type: "number" },
    ratificationCoordinate: { type: "number" },
  },
  required: ["signatureCoordinate", "ratificationCoordinate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elapsed: { type: "number" }, inOrder: { type: "boolean" } },
  required: ["elapsed", "inOrder"],
} as const;
/** Compare supplied public treaty-event coordinates without determining legal entry into force. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signatureCoordinate, ratificationCoordinate } = request;
  const compute = (): Output => {
    return {
      elapsed: ratificationCoordinate - signatureCoordinate,
      inOrder: ratificationCoordinate >= signatureCoordinate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signatureCoordinate: 100, ratificationCoordinate: 120 },
  output: { elapsed: 20, inOrder: true },
} satisfies ToolExample<Input, Output>;
export const treatySignatureRatificationOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-relations/treaty-signature-ratification-order",
    title: "Treaty Signature Ratification Order Tool",
    description:
      "Compare supplied public treaty-event coordinates without determining legal entry into force.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signatureCoordinate: { type: "number" },
        ratificationCoordinate: { type: "number" },
      },
      required: ["signatureCoordinate", "ratificationCoordinate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { elapsed: { type: "number" }, inOrder: { type: "boolean" } },
      required: ["elapsed", "inOrder"],
    },
    ports: {
      inputs: [
        {
          id: "signatureCoordinate",
          label: "Signature Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ratificationCoordinate",
          label: "Ratification Coordinate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        { id: "inOrder", label: "In Order", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = treatySignatureRatificationOrderTool.execute;
export default treatySignatureRatificationOrderTool;
