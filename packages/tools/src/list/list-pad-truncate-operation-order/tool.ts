import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly values: readonly string[];
  readonly padTo: number;
  readonly truncateTo: number;
  readonly padValue: string;
};
export type Output = {
  readonly padThenTruncate: readonly string[];
  readonly truncateThenPad: readonly string[];
  readonly equal: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    padTo: { type: "integer", minimum: 0, maximum: 256 },
    truncateTo: { type: "integer", minimum: 0, maximum: 256 },
    padValue: { type: "string", maxLength: 8192 },
  },
  required: ["values", "padTo", "truncateTo", "padValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    padThenTruncate: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    truncateThenPad: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    equal: { type: "boolean" },
  },
  required: ["padThenTruncate", "truncateThenPad", "equal"],
} as const;
/** Compare right-padding and prefix-truncation order on a bounded list. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { values, padTo, truncateTo, padValue } = request;
  const compute = (): Output => {
    H.integer(padTo, 0, 256);
    H.integer(truncateTo, 0, 256);
    const pad = (a: readonly string[]) => [
        ...a,
        ...Array(Math.max(0, padTo - a.length)).fill(padValue),
      ],
      padThenTruncate = pad(values).slice(0, truncateTo),
      truncateThenPad = pad(values.slice(0, truncateTo));
    return {
      padThenTruncate,
      truncateThenPad,
      equal:
        JSON.stringify(padThenTruncate) === JSON.stringify(truncateThenPad),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { values: ["a"], padTo: 3, truncateTo: 2, padValue: "x" },
  output: {
    padThenTruncate: ["a", "x"],
    truncateThenPad: ["a", "x", "x"],
    equal: false,
  },
} satisfies ToolExample<Input, Output>;
export const listPadTruncateOperationOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-pad-truncate-operation-order",
    title: "List Pad Truncate Operation Order Tool",
    description:
      "Compare right-padding and prefix-truncation order on a bounded list.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        values: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        padTo: { type: "integer", minimum: 0, maximum: 256 },
        truncateTo: { type: "integer", minimum: 0, maximum: 256 },
        padValue: { type: "string", maxLength: 8192 },
      },
      required: ["values", "padTo", "truncateTo", "padValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        padThenTruncate: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        truncateThenPad: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        equal: { type: "boolean" },
      },
      required: ["padThenTruncate", "truncateThenPad", "equal"],
    },
    ports: {
      inputs: [
        {
          id: "values",
          label: "Values",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "padTo",
          label: "Pad To",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "truncateTo",
          label: "Truncate To",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "padValue",
          label: "Pad Value",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "padThenTruncate",
          label: "Pad Then Truncate",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "truncateThenPad",
          label: "Truncate Then Pad",
          valueType: { type: "list", items: { type: "string" } },
        },
        { id: "equal", label: "Equal", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = listPadTruncateOperationOrderTool.execute;
export default listPadTruncateOperationOrderTool;
