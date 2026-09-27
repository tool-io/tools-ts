import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly smallestUnits: string;
  readonly unitsPerMajor: string;
  readonly unitsPerMiddle: string;
};
export type Output = {
  readonly majorDecimal: string;
  readonly middleDecimal: string;
  readonly remainderDecimal: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    smallestUnits: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    unitsPerMajor: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    unitsPerMiddle: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: ["smallestUnits", "unitsPerMajor", "unitsPerMiddle"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    majorDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    middleDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    remainderDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: ["majorDecimal", "middleDecimal", "remainderDecimal"],
} as const;
/** Divide a supplied historic currency amount through two explicit denomination radices; no exchange values are embedded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { smallestUnits, unitsPerMajor, unitsPerMiddle } = request;
  const compute = (): Output => {
    return (() => {
      const n = H.decimal(smallestUnits),
        a = H.decimal(unitsPerMajor),
        b = H.decimal(unitsPerMiddle);
      H.domain(n >= 0n && a > 0n && b > 0n && a % b === 0n);
      const r = n % a;
      return {
        majorDecimal: (n / a).toString(),
        middleDecimal: (r / b).toString(),
        remainderDecimal: (r % b).toString(),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { smallestUnits: "253", unitsPerMajor: "240", unitsPerMiddle: "12" },
  output: { majorDecimal: "1", middleDecimal: "1", remainderDecimal: "1" },
} satisfies ToolExample<Input, Output>;
export const historicCurrencyDivisionRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "european-studies/historic-currency-division-remainder",
    title: "Historic Currency Division Remainder Tool",
    description:
      "Divide a supplied historic currency amount through two explicit denomination radices; no exchange values are embedded.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        smallestUnits: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        unitsPerMajor: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        unitsPerMiddle: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["smallestUnits", "unitsPerMajor", "unitsPerMiddle"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        majorDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        middleDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        remainderDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["majorDecimal", "middleDecimal", "remainderDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "smallestUnits",
          label: "Smallest Units",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "unitsPerMajor",
          label: "Units Per Major",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "unitsPerMiddle",
          label: "Units Per Middle",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
      outputs: [
        {
          id: "majorDecimal",
          label: "Major Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "middleDecimal",
          label: "Middle Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "remainderDecimal",
          label: "Remainder Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
    },
  },
  calculate,
});
export const run = historicCurrencyDivisionRemainderTool.execute;
export default historicCurrencyDivisionRemainderTool;
