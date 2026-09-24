import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly second: number;
  readonly modulus: number;
};
export type Output = {
  readonly forwardDistance: number;
  readonly ambiguous: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "integer", minimum: 0 },
    second: { type: "integer", minimum: 0 },
    modulus: { type: "integer", minimum: 2 },
  },
  required: ["first", "second", "modulus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forwardDistance: { type: "integer" },
    ambiguous: { type: "boolean" },
  },
  required: ["forwardDistance", "ambiguous"],
} as const;
/** Flag an exact half-modulus sequence separation before assigning retry order. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, modulus } = request;
  const compute = (): Output => {
    H.integer(modulus, 2);
    H.domain(modulus % 2 === 0);
    H.integer(first, 0, modulus - 1);
    H.integer(second, 0, modulus - 1);
    const forwardDistance = Number(
      (BigInt(second) - BigInt(first) + BigInt(modulus)) % BigInt(modulus),
    );
    return { forwardDistance, ambiguous: forwardDistance === modulus / 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 0, second: 128, modulus: 256 },
  output: { forwardDistance: 128, ambiguous: true },
} satisfies ToolExample<Input, Output>;
export const messageRetrySequenceHalfwrapAmbiguityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "communication/message-retry-sequence-halfwrap-ambiguity",
      title: "Message Retry Sequence Halfwrap Ambiguity Tool",
      description:
        "Flag an exact half-modulus sequence separation before assigning retry order.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          first: { type: "integer", minimum: 0 },
          second: { type: "integer", minimum: 0 },
          modulus: { type: "integer", minimum: 2 },
        },
        required: ["first", "second", "modulus"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          forwardDistance: { type: "integer" },
          ambiguous: { type: "boolean" },
        },
        required: ["forwardDistance", "ambiguous"],
      },
      ports: {
        inputs: [
          {
            id: "first",
            label: "First",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "second",
            label: "Second",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "modulus",
            label: "Modulus",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "forwardDistance",
            label: "Forward Distance",
            valueType: { type: "integer" },
          },
          {
            id: "ambiguous",
            label: "Ambiguous",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = messageRetrySequenceHalfwrapAmbiguityTool.execute;
export default messageRetrySequenceHalfwrapAmbiguityTool;
