import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldLength: number;
  readonly newLength: number;
  readonly alphabet: number;
};
export type Output = { readonly delta: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldLength: { type: "integer", minimum: 0, maximum: 1000 },
    newLength: { type: "integer", minimum: 0, maximum: 1000 },
    alphabet: { type: "integer", minimum: 2, maximum: 256 },
  },
  required: ["oldLength", "newLength", "alphabet"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { delta: { type: "number" } },
  required: ["delta"],
} as const;
/** Calculate kraft single length change delta from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oldLength, newLength, alphabet } = request;
  const compute = (): Output => {
    H.integer(oldLength, 0, 1000);
    H.integer(newLength, 0, 1000);
    H.integer(alphabet, 2, 256);
    return { delta: alphabet ** -newLength - alphabet ** -oldLength };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { oldLength: 2, newLength: 3, alphabet: 2 },
  output: { delta: -0.125 },
} satisfies ToolExample<Input, Output>;
export const kraftSingleLengthChangeDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information/kraft-single-length-change-delta",
    title: "Kraft Single Length Change Delta Tool",
    description:
      "Calculate kraft single length change delta from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldLength: { type: "integer", minimum: 0, maximum: 1000 },
        newLength: { type: "integer", minimum: 0, maximum: 1000 },
        alphabet: { type: "integer", minimum: 2, maximum: 256 },
      },
      required: ["oldLength", "newLength", "alphabet"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { delta: { type: "number" } },
      required: ["delta"],
    },
    ports: {
      inputs: [
        {
          id: "oldLength",
          label: "Old Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "newLength",
          label: "New Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "alphabet",
          label: "Alphabet",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "delta", label: "Delta", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = kraftSingleLengthChangeDeltaTool.execute;
export default kraftSingleLengthChangeDeltaTool;
