import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly initialKey: string; readonly finalKey: string };
export type Output = {
  readonly changed: boolean;
  readonly keyPairJson: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialKey: { type: "string", maxLength: 8192, minLength: 1 },
    finalKey: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["initialKey", "finalKey"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    changed: { type: "boolean" },
    keyPairJson: { type: "string", maxLength: 8192 },
  },
  required: ["changed", "keyPairJson"],
} as const;
/** Compare explicit initial and final response keys while preserving their ordered pair without judging correctness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialKey, finalKey } = request;
  const compute = (): Output => {
    H.domain(initialKey.length > 0, "initialKey");
    H.domain(finalKey.length > 0, "finalKey");
    return {
      changed: initialKey !== finalKey,
      keyPairJson: JSON.stringify([initialKey, finalKey]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialKey: "left", finalKey: "right" },
  output: { changed: true, keyPairJson: '["left","right"]' },
} satisfies ToolExample<Input, Output>;
export const responseChangeInitialFinalKeyPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/response-change-initial-final-key-pair",
    title: "Response Change Initial Final Key Pair Tool",
    description:
      "Compare explicit initial and final response keys while preserving their ordered pair without judging correctness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialKey: { type: "string", maxLength: 8192, minLength: 1 },
        finalKey: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["initialKey", "finalKey"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        changed: { type: "boolean" },
        keyPairJson: { type: "string", maxLength: 8192 },
      },
      required: ["changed", "keyPairJson"],
    },
    ports: {
      inputs: [
        {
          id: "initialKey",
          label: "Initial Key",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "finalKey",
          label: "Final Key",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "changed", label: "Changed", valueType: { type: "boolean" } },
        {
          id: "keyPairJson",
          label: "Key Pair Json",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = responseChangeInitialFinalKeyPairTool.execute;
export default responseChangeInitialFinalKeyPairTool;
