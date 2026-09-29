import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stockUnits: readonly number[];
  readonly countVerified: readonly boolean[];
  readonly locationVerified: readonly boolean[];
  readonly statusKnown: readonly boolean[];
};
export type Output = {
  readonly totalUnitsDecimal: string;
  readonly supportedUnitsDecimal: string;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stockUnits: {
      type: "array",
      maxItems: 256,
      items: { type: "integer", minimum: 0 },
    },
    countVerified: { type: "array", maxItems: 256, items: { type: "boolean" } },
    locationVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    statusKnown: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["stockUnits", "countVerified", "locationVerified", "statusKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalUnitsDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    supportedUnitsDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["totalUnitsDecimal", "supportedUnitsDecimal", "share", "defined"],
} as const;
/** Calculate ward stock support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stockUnits, countVerified, locationVerified, statusKnown } = request;
  const compute = (): Output => {
    H.sameLength(stockUnits, countVerified);
    H.sameLength(stockUnits, locationVerified);
    H.sameLength(stockUnits, statusKnown);
    H.domain(stockUnits.every((x) => x >= 0));
    return (() => {
      const a = stockUnits.reduce((s, x) => s + BigInt(x), 0n),
        b = stockUnits.reduce(
          (s, x, i) =>
            s +
            (countVerified[i] && locationVerified[i] && statusKnown[i]
              ? BigInt(x)
              : 0n),
          0n,
        );
      return {
        totalUnitsDecimal: a.toString(),
        supportedUnitsDecimal: b.toString(),
        share: a > 0n ? Number(b) / Number(a) : 0,
        defined: a > 0n,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stockUnits: [2, 3, 5],
    countVerified: [true, true, true],
    locationVerified: [true, true, false],
    statusKnown: [true, false, true],
  },
  output: {
    totalUnitsDecimal: "10",
    supportedUnitsDecimal: "2",
    share: 0.2,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const wardStockSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospital-pharmacy/ward-stock-support-share",
    title: "Ward Stock Support Share Tool",
    description:
      "Calculate ward stock support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stockUnits: {
          type: "array",
          maxItems: 256,
          items: { type: "integer", minimum: 0 },
        },
        countVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        locationVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        statusKnown: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "stockUnits",
        "countVerified",
        "locationVerified",
        "statusKnown",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalUnitsDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        supportedUnitsDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "totalUnitsDecimal",
        "supportedUnitsDecimal",
        "share",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "stockUnits",
          label: "Stock Units",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "countVerified",
          label: "Count Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "locationVerified",
          label: "Location Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "statusKnown",
          label: "Status Known",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "totalUnitsDecimal",
          label: "Total Units Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "supportedUnitsDecimal",
          label: "Supported Units Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = wardStockSupportShareTool.execute;
export default wardStockSupportShareTool;
