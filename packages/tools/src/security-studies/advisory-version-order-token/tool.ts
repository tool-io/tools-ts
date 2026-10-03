import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: string;
  readonly second: string;
  readonly suppliedOrder: readonly string[];
};
export type Output = {
  readonly firstKnown: boolean;
  readonly secondKnown: boolean;
  readonly order: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "string", maxLength: 8192 },
    second: { type: "string", maxLength: 8192 },
    suppliedOrder: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["first", "second", "suppliedOrder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstKnown: { type: "boolean" },
    secondKnown: { type: "boolean" },
    order: { type: "integer" },
  },
  required: ["firstKnown", "secondKnown", "order"],
} as const;
/** Compare advisory tokens under an explicit order without guessing vendor version semantics. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, suppliedOrder } = request;
  const compute = (): Output => {
    H.domain(new Set(suppliedOrder).size === suppliedOrder.length);
    const a = suppliedOrder.indexOf(first),
      b = suppliedOrder.indexOf(second);
    return {
      firstKnown: a >= 0,
      secondKnown: b >= 0,
      order: a >= 0 && b >= 0 ? Math.sign(b - a) : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: "v2", second: "v3", suppliedOrder: ["v1", "v2", "v3"] },
  output: { firstKnown: true, secondKnown: true, order: 1 },
} satisfies ToolExample<Input, Output>;
export const advisoryVersionOrderTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "security-studies/advisory-version-order-token",
    title: "Advisory Version Order Token Tool",
    description:
      "Compare advisory tokens under an explicit order without guessing vendor version semantics.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "string", maxLength: 8192 },
        second: { type: "string", maxLength: 8192 },
        suppliedOrder: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["first", "second", "suppliedOrder"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstKnown: { type: "boolean" },
        secondKnown: { type: "boolean" },
        order: { type: "integer" },
      },
      required: ["firstKnown", "secondKnown", "order"],
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
        {
          id: "suppliedOrder",
          label: "Supplied Order",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "firstKnown",
          label: "First Known",
          valueType: { type: "boolean" },
        },
        {
          id: "secondKnown",
          label: "Second Known",
          valueType: { type: "boolean" },
        },
        { id: "order", label: "Order", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = advisoryVersionOrderTokenTool.execute;
export default advisoryVersionOrderTokenTool;
