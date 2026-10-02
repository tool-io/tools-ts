import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: string; readonly second: string };
export type Output = { readonly value: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: {
      type: "string",
      maxLength: 8192,
      enum: ["true", "false", "unknown"],
    },
    second: {
      type: "string",
      maxLength: 8192,
      enum: ["true", "false", "unknown"],
    },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "string", maxLength: 8192 } },
  required: ["value"],
} as const;
/** Strong Kleene exclusive-or: an unknown operand gives unknown. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    H.domain(["true", "false", "unknown"].includes(first));
    H.domain(["true", "false", "unknown"].includes(second));
    return {
      value:
        first === "unknown" || second === "unknown"
          ? "unknown"
          : String(first !== second),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: "true", second: "false" },
  output: { value: "true" },
} satisfies ToolExample<Input, Output>;
export const exclusiveOrThreeValuedUnknownCaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/exclusive-or-three-valued-unknown-case",
    title: "Exclusive OR Three Valued Unknown Case Tool",
    description:
      "Strong Kleene exclusive-or: an unknown operand gives unknown.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: {
          type: "string",
          maxLength: 8192,
          enum: ["true", "false", "unknown"],
        },
        second: {
          type: "string",
          maxLength: 8192,
          enum: ["true", "false", "unknown"],
        },
      },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { value: { type: "string", maxLength: 8192 } },
      required: ["value"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "value", label: "Value", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = exclusiveOrThreeValuedUnknownCaseTool.execute;
export default exclusiveOrThreeValuedUnknownCaseTool;
