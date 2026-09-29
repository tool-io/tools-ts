import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cumulative: readonly number[];
  readonly descending: boolean;
};
export type Output = {
  readonly increments: readonly number[];
  readonly total: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cumulative: { type: "array", maxItems: 256, items: { type: "number" } },
    descending: { type: "boolean" },
  },
  required: ["cumulative", "descending"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    increments: { type: "array", maxItems: 256, items: { type: "number" } },
    total: { type: "number" },
  },
  required: ["increments", "total"],
} as const;
/** Convert explicit monotone cumulative sieve masses into incremental fractions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cumulative, descending } = request;
  const compute = (): Output => {
    H.domain(
      cumulative.length > 0 &&
        cumulative.every(
          (x, i) =>
            x >= 0 &&
            (i === 0 ||
              (descending ? x <= cumulative[i - 1] : x >= cumulative[i - 1])),
        ),
      "cumulative",
    );
    const increments = descending
      ? cumulative.map((x, i) => x - (cumulative[i + 1] ?? 0))
      : cumulative.map((x, i) => x - (i ? cumulative[i - 1] : 0));
    return {
      increments,
      total: descending ? cumulative[0] : cumulative[cumulative.length - 1],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cumulative: [10, 30, 100], descending: false },
  output: { increments: [10, 20, 70], total: 100 },
} satisfies ToolExample<Input, Output>;
export const granuleSieveCumulativeIncrementCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "industrial-pharmacy/granule-sieve-cumulative-increment-crosswalk",
      title: "Granule Sieve Cumulative Increment Crosswalk Tool",
      description:
        "Convert explicit monotone cumulative sieve masses into incremental fractions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cumulative: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          descending: { type: "boolean" },
        },
        required: ["cumulative", "descending"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          increments: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          total: { type: "number" },
        },
        required: ["increments", "total"],
      },
      ports: {
        inputs: [
          {
            id: "cumulative",
            label: "Cumulative",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "descending",
            label: "Descending",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "increments",
            label: "Increments",
            valueType: { type: "list", items: { type: "number" } },
          },
          { id: "total", label: "Total", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = granuleSieveCumulativeIncrementCrosswalkTool.execute;
export default granuleSieveCumulativeIncrementCrosswalkTool;
