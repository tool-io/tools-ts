import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly treeCounts: readonly number[];
  readonly cohortSourceIds: readonly string[];
  readonly unknownToken: string;
};
export type Output = {
  readonly totalTreesDecimal: string;
  readonly unknownTreesDecimal: string;
  readonly unknownShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    treeCounts: {
      type: "array",
      maxItems: 256,
      items: { type: "integer", minimum: 0 },
    },
    cohortSourceIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    unknownToken: { type: "string", maxLength: 8192 },
  },
  required: ["treeCounts", "cohortSourceIds", "unknownToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalTreesDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    unknownTreesDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    unknownShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "totalTreesDecimal",
    "unknownTreesDecimal",
    "unknownShare",
    "defined",
  ],
} as const;
/** Calculate tree cohort source unknown share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { treeCounts, cohortSourceIds, unknownToken } = request;
  const compute = (): Output => {
    H.sameLength(treeCounts, cohortSourceIds);
    H.domain(treeCounts.every((x) => x >= 0));
    return (() => {
      const a = treeCounts.reduce((s, x) => s + BigInt(x), 0n),
        b = treeCounts.reduce(
          (s, x, i) =>
            s + (cohortSourceIds[i] === unknownToken ? BigInt(x) : 0n),
          0n,
        );
      return {
        totalTreesDecimal: a.toString(),
        unknownTreesDecimal: b.toString(),
        unknownShare: a > 0n ? Number(b) / Number(a) : 0,
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
    treeCounts: [2, 3, 5],
    cohortSourceIds: ["known", "?", "known"],
    unknownToken: "?",
  },
  output: {
    totalTreesDecimal: "10",
    unknownTreesDecimal: "3",
    unknownShare: 0.3,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const treeCohortSourceUnknownShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroforestry/tree-cohort-source-unknown-share",
    title: "Tree Cohort Source Unknown Share Tool",
    description:
      "Calculate tree cohort source unknown share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        treeCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer", minimum: 0 },
        },
        cohortSourceIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        unknownToken: { type: "string", maxLength: 8192 },
      },
      required: ["treeCounts", "cohortSourceIds", "unknownToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalTreesDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        unknownTreesDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        unknownShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "totalTreesDecimal",
        "unknownTreesDecimal",
        "unknownShare",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "treeCounts",
          label: "Tree Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "cohortSourceIds",
          label: "Cohort Source Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "unknownToken",
          label: "Unknown Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "totalTreesDecimal",
          label: "Total Trees Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "unknownTreesDecimal",
          label: "Unknown Trees Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "unknownShare",
          label: "Unknown Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = treeCohortSourceUnknownShareTool.execute;
export default treeCohortSourceUnknownShareTool;
