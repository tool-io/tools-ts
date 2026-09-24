import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly periodIds: readonly string[];
  readonly allocationCounts: readonly number[];
  readonly sourceCounts: readonly number[];
  readonly verified: readonly boolean[];
};
export type Output = {
  readonly allocatedDecimal: string;
  readonly supportedDecimal: string;
  readonly discrepantPeriods: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    periodIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    allocationCounts: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    sourceCounts: { type: "array", maxItems: 256, items: { type: "integer" } },
    verified: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["periodIds", "allocationCounts", "sourceCounts", "verified"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocatedDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    supportedDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    discrepantPeriods: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "allocatedDecimal",
    "supportedDecimal",
    "discrepantPeriods",
    "share",
    "defined",
  ],
} as const;
/** Calculate allocation period support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { periodIds, allocationCounts, sourceCounts, verified } = request;
  const compute = (): Output => {
    H.sameLength(periodIds, allocationCounts);
    H.sameLength(periodIds, sourceCounts);
    H.sameLength(periodIds, verified);
    H.domain([...allocationCounts, ...sourceCounts].every((x) => x >= 0));
    return (() => {
      const a = allocationCounts.reduce((s, x) => s + BigInt(x), 0n),
        b = allocationCounts.reduce(
          (s, x, i) =>
            s + (verified[i] && x === sourceCounts[i] ? BigInt(x) : 0n),
          0n,
        );
      return {
        allocatedDecimal: a.toString(),
        supportedDecimal: b.toString(),
        discrepantPeriods: periodIds.filter(
          (x, i) => allocationCounts[i] !== sourceCounts[i],
        ).length,
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
    periodIds: ["a", "b"],
    allocationCounts: [2, 3],
    sourceCounts: [2, 4],
    verified: [true, true],
  },
  output: {
    allocatedDecimal: "5",
    supportedDecimal: "2",
    discrepantPeriods: 1,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const allocationPeriodSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-trials/allocation-period-support-share",
    title: "Allocation Period Support Share Tool",
    description:
      "Calculate allocation period support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        periodIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        allocationCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        sourceCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        verified: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["periodIds", "allocationCounts", "sourceCounts", "verified"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocatedDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        supportedDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        discrepantPeriods: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "allocatedDecimal",
        "supportedDecimal",
        "discrepantPeriods",
        "share",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "periodIds",
          label: "Period Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "allocationCounts",
          label: "Allocation Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "sourceCounts",
          label: "Source Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "verified",
          label: "Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "allocatedDecimal",
          label: "Allocated Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "supportedDecimal",
          label: "Supported Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "discrepantPeriods",
          label: "Discrepant Periods",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = allocationPeriodSupportShareTool.execute;
export default allocationPeriodSupportShareTool;
