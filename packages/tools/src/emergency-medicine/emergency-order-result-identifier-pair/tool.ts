import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly orderId: string;
  readonly resultId: string;
  readonly sourceSystem: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orderId: { type: "string", maxLength: 8192, minLength: 1 },
    resultId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceSystem: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["orderId", "resultId", "sourceSystem"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Link explicit emergency order and result identifiers under a supplied system namespace without asserting clinical correspondence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { orderId, resultId, sourceSystem } = request;
  const compute = (): Output => {
    H.domain(orderId.length > 0, "orderId");
    H.domain(resultId.length > 0, "resultId");
    H.domain(sourceSystem.length > 0, "sourceSystem");
    return { token: JSON.stringify([orderId, resultId, sourceSystem]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { orderId: "O17", resultId: "R4", sourceSystem: "SYS2" },
  output: { token: '["O17","R4","SYS2"]' },
} satisfies ToolExample<Input, Output>;
export const emergencyOrderResultIdentifierPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "emergency-medicine/emergency-order-result-identifier-pair",
    title: "Emergency Order Result Identifier Pair Tool",
    description:
      "Link explicit emergency order and result identifiers under a supplied system namespace without asserting clinical correspondence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orderId: { type: "string", maxLength: 8192, minLength: 1 },
        resultId: { type: "string", maxLength: 8192, minLength: 1 },
        sourceSystem: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["orderId", "resultId", "sourceSystem"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "orderId",
          label: "Order Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "resultId",
          label: "Result Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceSystem",
          label: "Source System",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = emergencyOrderResultIdentifierPairTool.execute;
export default emergencyOrderResultIdentifierPairTool;
