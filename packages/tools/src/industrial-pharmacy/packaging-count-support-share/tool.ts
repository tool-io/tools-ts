import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly componentCounts: readonly number[];
  readonly countVerified: readonly boolean[];
  readonly artworkMatched: readonly boolean[];
  readonly lotTraceable: readonly boolean[];
};
export type Output = {
  readonly totalDecimal: string;
  readonly supportedDecimal: string;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    componentCounts: {
      type: "array",
      maxItems: 256,
      items: { type: "integer", minimum: 0 },
    },
    countVerified: { type: "array", maxItems: 256, items: { type: "boolean" } },
    artworkMatched: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    lotTraceable: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: [
    "componentCounts",
    "countVerified",
    "artworkMatched",
    "lotTraceable",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    supportedDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["totalDecimal", "supportedDecimal", "share", "defined"],
} as const;
/** Calculate packaging count support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { componentCounts, countVerified, artworkMatched, lotTraceable } =
    request;
  const compute = (): Output => {
    H.sameLength(componentCounts, countVerified);
    H.sameLength(componentCounts, artworkMatched);
    H.sameLength(componentCounts, lotTraceable);
    H.domain(componentCounts.every((x) => x >= 0));
    return (() => {
      const a = componentCounts.reduce((s, x) => s + BigInt(x), 0n),
        b = componentCounts.reduce(
          (s, x, i) =>
            s +
            (countVerified[i] && artworkMatched[i] && lotTraceable[i]
              ? BigInt(x)
              : 0n),
          0n,
        );
      return {
        totalDecimal: a.toString(),
        supportedDecimal: b.toString(),
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
    componentCounts: [2, 3, 5],
    countVerified: [true, true, true],
    artworkMatched: [true, true, false],
    lotTraceable: [true, false, true],
  },
  output: {
    totalDecimal: "10",
    supportedDecimal: "2",
    share: 0.2,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const packagingCountSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-pharmacy/packaging-count-support-share",
    title: "Packaging Count Support Share Tool",
    description:
      "Calculate packaging count support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        componentCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer", minimum: 0 },
        },
        countVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        artworkMatched: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        lotTraceable: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "componentCounts",
        "countVerified",
        "artworkMatched",
        "lotTraceable",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        supportedDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["totalDecimal", "supportedDecimal", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "componentCounts",
          label: "Component Counts",
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
          id: "artworkMatched",
          label: "Artwork Matched",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "lotTraceable",
          label: "Lot Traceable",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "totalDecimal",
          label: "Total Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "supportedDecimal",
          label: "Supported Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = packagingCountSupportShareTool.execute;
export default packagingCountSupportShareTool;
