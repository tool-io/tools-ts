import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly string[];
  readonly second: readonly string[];
  readonly limit: number;
};
export type Output = {
  readonly equal: boolean;
  readonly compared: number;
  readonly mismatch: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    second: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    limit: { type: "integer", minimum: 0, maximum: 256 },
  },
  required: ["first", "second", "limit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equal: { type: "boolean" },
    compared: { type: "integer" },
    mismatch: { type: "integer" },
  },
  required: ["equal", "compared", "mismatch"],
} as const;
/** Calculate list bounded prefix equality witness from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { first, second, limit } = input;
  const compute = (): Output => {
    H.integer(limit, 0, 256);
    const compared = Math.min(limit, first.length, second.length);
    let mismatch = -1;
    for (let i = 0; i < compared; i++)
      if (first[i] !== second[i]) {
        mismatch = i;
        break;
      }
    if (mismatch < 0 && compared < limit && first.length !== second.length)
      mismatch = compared;
    return { equal: mismatch < 0, compared, mismatch };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { first: ["a", "b"], second: ["a", "c"], limit: 2 },
  output: { equal: false, compared: 2, mismatch: 1 },
} satisfies ToolExample<Input, Output>;
export const listBoundedPrefixEqualityWitnessTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-bounded-prefix-equality-witness",
    title: "List Bounded Prefix Equality Witness Tool",
    description:
      "Calculate list bounded prefix equality witness from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        second: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        limit: { type: "integer", minimum: 0, maximum: 256 },
      },
      required: ["first", "second", "limit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        equal: { type: "boolean" },
        compared: { type: "integer" },
        mismatch: { type: "integer" },
      },
      required: ["equal", "compared", "mismatch"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "limit",
          label: "Limit",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "equal", label: "Equal", valueType: { type: "boolean" } },
        { id: "compared", label: "Compared", valueType: { type: "integer" } },
        { id: "mismatch", label: "Mismatch", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = listBoundedPrefixEqualityWitnessTool.execute;
export default listBoundedPrefixEqualityWitnessTool;
