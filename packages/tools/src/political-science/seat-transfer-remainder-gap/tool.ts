import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beforeSeats: readonly number[];
  readonly afterSeats: readonly number[];
  readonly totalSeats: number;
};
export type Output = {
  readonly beforeRemainderDecimal: string;
  readonly afterRemainderDecimal: string;
  readonly remainderChangeDecimal: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeSeats: { type: "array", maxItems: 256, items: { type: "integer" } },
    afterSeats: { type: "array", maxItems: 256, items: { type: "integer" } },
    totalSeats: { type: "integer", minimum: 0 },
  },
  required: ["beforeSeats", "afterSeats", "totalSeats"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeRemainderDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    afterRemainderDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    remainderChangeDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: [
    "beforeRemainderDecimal",
    "afterRemainderDecimal",
    "remainderChangeDecimal",
  ],
} as const;
/** Compare explicit unassigned-seat remainders without selecting an apportionment method. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beforeSeats, afterSeats, totalSeats } = request;
  const compute = (): Output => {
    H.sameLength(beforeSeats, afterSeats);
    H.integer(totalSeats, 0);
    H.domain([...beforeSeats, ...afterSeats].every((x) => x >= 0));
    return (() => {
      const a =
          BigInt(totalSeats) - beforeSeats.reduce((s, x) => s + BigInt(x), 0n),
        b = BigInt(totalSeats) - afterSeats.reduce((s, x) => s + BigInt(x), 0n);
      return {
        beforeRemainderDecimal: a.toString(),
        afterRemainderDecimal: b.toString(),
        remainderChangeDecimal: (b - a).toString(),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { beforeSeats: [2, 3], afterSeats: [3, 3], totalSeats: 7 },
  output: {
    beforeRemainderDecimal: "2",
    afterRemainderDecimal: "1",
    remainderChangeDecimal: "-1",
  },
} satisfies ToolExample<Input, Output>;
export const seatTransferRemainderGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/seat-transfer-remainder-gap",
    title: "Seat Transfer Remainder Gap Tool",
    description:
      "Compare explicit unassigned-seat remainders without selecting an apportionment method.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beforeSeats: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        afterSeats: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        totalSeats: { type: "integer", minimum: 0 },
      },
      required: ["beforeSeats", "afterSeats", "totalSeats"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beforeRemainderDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        afterRemainderDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        remainderChangeDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: [
        "beforeRemainderDecimal",
        "afterRemainderDecimal",
        "remainderChangeDecimal",
      ],
    },
    ports: {
      inputs: [
        {
          id: "beforeSeats",
          label: "Before Seats",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "afterSeats",
          label: "After Seats",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "totalSeats",
          label: "Total Seats",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "beforeRemainderDecimal",
          label: "Before Remainder Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "afterRemainderDecimal",
          label: "After Remainder Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "remainderChangeDecimal",
          label: "Remainder Change Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
    },
  },
  calculate,
});
export const run = seatTransferRemainderGapTool.execute;
export default seatTransferRemainderGapTool;
