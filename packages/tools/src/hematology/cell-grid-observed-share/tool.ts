import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cellCounts: readonly number[];
  readonly gridObserved: readonly boolean[];
  readonly gridEligible: readonly boolean[];
};
export type Output = {
  readonly eligibleCountDecimal: string;
  readonly observedCountDecimal: string;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cellCounts: {
      type: "array",
      maxItems: 256,
      items: { type: "integer", minimum: 0 },
    },
    gridObserved: { type: "array", maxItems: 256, items: { type: "boolean" } },
    gridEligible: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["cellCounts", "gridObserved", "gridEligible"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleCountDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    observedCountDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "eligibleCountDecimal",
    "observedCountDecimal",
    "share",
    "defined",
  ],
} as const;
/** Calculate cell grid observed share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cellCounts, gridObserved, gridEligible } = request;
  const compute = (): Output => {
    H.sameLength(cellCounts, gridObserved);
    H.sameLength(cellCounts, gridEligible);
    H.domain(cellCounts.every((x) => x >= 0));
    return (() => {
      const a = cellCounts.reduce(
          (s, x, i) => s + (gridEligible[i] ? BigInt(x) : 0n),
          0n,
        ),
        b = cellCounts.reduce(
          (s, x, i) =>
            s + (gridEligible[i] && gridObserved[i] ? BigInt(x) : 0n),
          0n,
        );
      return {
        eligibleCountDecimal: a.toString(),
        observedCountDecimal: b.toString(),
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
    cellCounts: [2, 3, 5],
    gridObserved: [true, false, true],
    gridEligible: [true, true, false],
  },
  output: {
    eligibleCountDecimal: "5",
    observedCountDecimal: "2",
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const cellGridObservedShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hematology/cell-grid-observed-share",
    title: "Cell Grid Observed Share Tool",
    description:
      "Calculate cell grid observed share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cellCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer", minimum: 0 },
        },
        gridObserved: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        gridEligible: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["cellCounts", "gridObserved", "gridEligible"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleCountDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        observedCountDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "eligibleCountDecimal",
        "observedCountDecimal",
        "share",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "cellCounts",
          label: "Cell Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "gridObserved",
          label: "Grid Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "gridEligible",
          label: "Grid Eligible",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "eligibleCountDecimal",
          label: "Eligible Count Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "observedCountDecimal",
          label: "Observed Count Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = cellGridObservedShareTool.execute;
export default cellGridObservedShareTool;
