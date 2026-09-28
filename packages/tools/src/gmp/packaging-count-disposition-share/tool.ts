import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dispositionCounts: readonly number[];
  readonly requestedIndex: number;
};
export type Output = {
  readonly totalDecimal: string;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dispositionCounts: {
      type: "array",
      maxItems: 256,
      items: { type: "integer", minimum: 0 },
    },
    requestedIndex: { type: "integer", minimum: 0 },
  },
  required: ["dispositionCounts", "requestedIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalDecimal: { type: "string", maxLength: 8192 },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["totalDecimal", "share", "defined"],
} as const;
/** Calculate packaging count disposition share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dispositionCounts, requestedIndex } = request;
  const compute = (): Output => {
    H.domain(dispositionCounts.every((x) => x >= 0));
    H.integer(requestedIndex, 0, dispositionCounts.length - 1);
    return (() => {
      const total = dispositionCounts.reduce((s, n) => s + BigInt(n), 0n);
      return {
        totalDecimal: total.toString(),
        share:
          total > 0n ? dispositionCounts[requestedIndex] / Number(total) : 0,
        defined: total > 0n,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dispositionCounts: [20, 80], requestedIndex: 0 },
  output: { totalDecimal: "100", share: 0.2, defined: true },
} satisfies ToolExample<Input, Output>;
export const packagingCountDispositionShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gmp/packaging-count-disposition-share",
    title: "Packaging Count Disposition Share Tool",
    description:
      "Calculate packaging count disposition share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dispositionCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer", minimum: 0 },
        },
        requestedIndex: { type: "integer", minimum: 0 },
      },
      required: ["dispositionCounts", "requestedIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalDecimal: { type: "string", maxLength: 8192 },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["totalDecimal", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "dispositionCounts",
          label: "Disposition Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "requestedIndex",
          label: "Requested Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "totalDecimal",
          label: "Total Decimal",
          valueType: { type: "string" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = packagingCountDispositionShareTool.execute;
export default packagingCountDispositionShareTool;
