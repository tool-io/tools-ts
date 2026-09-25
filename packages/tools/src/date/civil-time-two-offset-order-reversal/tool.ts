import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLocalMinute: number;
  readonly secondLocalMinute: number;
  readonly firstOffset: number;
  readonly secondOffset: number;
};
export type Output = {
  readonly localOrder: number;
  readonly utcOrder: number;
  readonly reversed: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLocalMinute: { type: "integer" },
    secondLocalMinute: { type: "integer" },
    firstOffset: { type: "integer", minimum: -1439, maximum: 1439 },
    secondOffset: { type: "integer", minimum: -1439, maximum: 1439 },
  },
  required: [
    "firstLocalMinute",
    "secondLocalMinute",
    "firstOffset",
    "secondOffset",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localOrder: { type: "integer" },
    utcOrder: { type: "integer" },
    reversed: { type: "boolean" },
  },
  required: ["localOrder", "utcOrder", "reversed"],
} as const;
/** Calculate civil time two offset order reversal from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { firstLocalMinute, secondLocalMinute, firstOffset, secondOffset } =
    input;
  const compute = (): Output => {
    H.integer(firstOffset, -1439, 1439);
    H.integer(secondOffset, -1439, 1439);
    const localOrder = Math.sign(secondLocalMinute - firstLocalMinute),
      utcOrder = Math.sign(
        secondLocalMinute - secondOffset - (firstLocalMinute - firstOffset),
      );
    return { localOrder, utcOrder, reversed: localOrder * utcOrder < 0 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    firstLocalMinute: 600,
    secondLocalMinute: 630,
    firstOffset: 0,
    secondOffset: 120,
  },
  output: { localOrder: 1, utcOrder: -1, reversed: true },
} satisfies ToolExample<Input, Output>;
export const civilTimeTwoOffsetOrderReversalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "date/civil-time-two-offset-order-reversal",
    title: "Civil Time Two Offset Order Reversal Tool",
    description:
      "Calculate civil time two offset order reversal from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLocalMinute: { type: "integer" },
        secondLocalMinute: { type: "integer" },
        firstOffset: { type: "integer", minimum: -1439, maximum: 1439 },
        secondOffset: { type: "integer", minimum: -1439, maximum: 1439 },
      },
      required: [
        "firstLocalMinute",
        "secondLocalMinute",
        "firstOffset",
        "secondOffset",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        localOrder: { type: "integer" },
        utcOrder: { type: "integer" },
        reversed: { type: "boolean" },
      },
      required: ["localOrder", "utcOrder", "reversed"],
    },
    ports: {
      inputs: [
        {
          id: "firstLocalMinute",
          label: "First Local Minute",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondLocalMinute",
          label: "Second Local Minute",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstOffset",
          label: "First Offset",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondOffset",
          label: "Second Offset",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "localOrder",
          label: "Local Order",
          valueType: { type: "integer" },
        },
        { id: "utcOrder", label: "Utc Order", valueType: { type: "integer" } },
        { id: "reversed", label: "Reversed", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = civilTimeTwoOffsetOrderReversalTool.execute;
export default civilTimeTwoOffsetOrderReversalTool;
