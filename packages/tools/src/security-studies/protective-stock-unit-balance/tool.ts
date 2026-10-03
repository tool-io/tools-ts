import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opening: string;
  readonly received: string;
  readonly issued: string;
  readonly damaged: string;
  readonly unitsPerPack: string;
};
export type Output = {
  readonly remainingDecimal: string;
  readonly wholePacksDecimal: string;
  readonly looseUnitsDecimal: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opening: { type: "string", maxLength: 8192, format: "integer-decimal" },
    received: { type: "string", maxLength: 8192, format: "integer-decimal" },
    issued: { type: "string", maxLength: 8192, format: "integer-decimal" },
    damaged: { type: "string", maxLength: 8192, format: "integer-decimal" },
    unitsPerPack: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: ["opening", "received", "issued", "damaged", "unitsPerPack"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    wholePacksDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    looseUnitsDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: ["remainingDecimal", "wholePacksDecimal", "looseUnitsDecimal"],
} as const;
/** Balance explicitly supplied protective-supply records and packaging units; no operational security planning. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { opening, received, issued, damaged, unitsPerPack } = request;
  const compute = (): Output => {
    return (() => {
      const remaining =
          H.decimal(opening) +
          H.decimal(received) -
          H.decimal(issued) -
          H.decimal(damaged),
        p = H.decimal(unitsPerPack);
      H.domain(
        [opening, received, issued, damaged].every((x) => H.decimal(x) >= 0n) &&
          p > 0n &&
          remaining >= 0n,
      );
      return {
        remainingDecimal: remaining.toString(),
        wholePacksDecimal: (remaining / p).toString(),
        looseUnitsDecimal: (remaining % p).toString(),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    opening: "20",
    received: "10",
    issued: "4",
    damaged: "1",
    unitsPerPack: "6",
  },
  output: {
    remainingDecimal: "25",
    wholePacksDecimal: "4",
    looseUnitsDecimal: "1",
  },
} satisfies ToolExample<Input, Output>;
export const protectiveStockUnitBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "security-studies/protective-stock-unit-balance",
    title: "Protective Stock Unit Balance Tool",
    description:
      "Balance explicitly supplied protective-supply records and packaging units; no operational security planning.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        opening: { type: "string", maxLength: 8192, format: "integer-decimal" },
        received: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        issued: { type: "string", maxLength: 8192, format: "integer-decimal" },
        damaged: { type: "string", maxLength: 8192, format: "integer-decimal" },
        unitsPerPack: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["opening", "received", "issued", "damaged", "unitsPerPack"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        wholePacksDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        looseUnitsDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["remainingDecimal", "wholePacksDecimal", "looseUnitsDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "opening",
          label: "Opening",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "received",
          label: "Received",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "issued",
          label: "Issued",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "damaged",
          label: "Damaged",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "unitsPerPack",
          label: "Units Per Pack",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
      outputs: [
        {
          id: "remainingDecimal",
          label: "Remaining Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "wholePacksDecimal",
          label: "Whole Packs Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "looseUnitsDecimal",
          label: "Loose Units Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
    },
  },
  calculate,
});
export const run = protectiveStockUnitBalanceTool.execute;
export default protectiveStockUnitBalanceTool;
