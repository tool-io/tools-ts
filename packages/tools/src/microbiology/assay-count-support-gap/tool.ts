import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly counts: readonly number[];
  readonly validDenominator: readonly boolean[];
  readonly referenceCounts: readonly number[];
};
export type Output = {
  readonly observedSupportedDecimal: string;
  readonly referenceSupportedDecimal: string;
  readonly gapDecimal: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    counts: { type: "array", maxItems: 256, items: { type: "integer" } },
    validDenominator: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    referenceCounts: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["counts", "validDenominator", "referenceCounts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedSupportedDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    referenceSupportedDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    gapDecimal: { type: "string", maxLength: 8192, format: "integer-decimal" },
  },
  required: [
    "observedSupportedDecimal",
    "referenceSupportedDecimal",
    "gapDecimal",
  ],
} as const;
/** Calculate assay count support gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { counts, validDenominator, referenceCounts } = request;
  const compute = (): Output => {
    H.sameLength(counts, validDenominator);
    H.sameLength(counts, referenceCounts);
    H.domain([...counts, ...referenceCounts].every((x) => x >= 0));
    return (() => {
      const a = counts.reduce(
          (s, x, i) => s + (validDenominator[i] ? BigInt(x) : 0n),
          0n,
        ),
        b = referenceCounts.reduce(
          (s, x, i) => s + (validDenominator[i] ? BigInt(x) : 0n),
          0n,
        );
      return {
        observedSupportedDecimal: a.toString(),
        referenceSupportedDecimal: b.toString(),
        gapDecimal: (a - b).toString(),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    counts: [2, 5],
    validDenominator: [true, false],
    referenceCounts: [3, 4],
  },
  output: {
    observedSupportedDecimal: "2",
    referenceSupportedDecimal: "3",
    gapDecimal: "-1",
  },
} satisfies ToolExample<Input, Output>;
export const assayCountSupportGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microbiology/assay-count-support-gap",
    title: "Assay Count Support Gap Tool",
    description:
      "Calculate assay count support gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        counts: { type: "array", maxItems: 256, items: { type: "integer" } },
        validDenominator: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        referenceCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["counts", "validDenominator", "referenceCounts"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedSupportedDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        referenceSupportedDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        gapDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: [
        "observedSupportedDecimal",
        "referenceSupportedDecimal",
        "gapDecimal",
      ],
    },
    ports: {
      inputs: [
        {
          id: "counts",
          label: "Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "validDenominator",
          label: "Valid Denominator",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "referenceCounts",
          label: "Reference Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "observedSupportedDecimal",
          label: "Observed Supported Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "referenceSupportedDecimal",
          label: "Reference Supported Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "gapDecimal",
          label: "Gap Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
    },
  },
  calculate,
});
export const run = assayCountSupportGapTool.execute;
export default assayCountSupportGapTool;
