import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly counts: readonly number[];
  readonly minimum: number;
};
export type Output = {
  readonly suppressedIndices: readonly number[];
  readonly releasedIndices: readonly number[];
  readonly releasedCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    counts: { type: "array", maxItems: 256, items: { type: "integer" } },
    minimum: { type: "integer", minimum: 0 },
  },
  required: ["counts", "minimum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppressedIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    releasedIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    releasedCount: { type: "integer" },
  },
  required: ["suppressedIndices", "releasedIndices", "releasedCount"],
} as const;
/** Apply a supplied direct small-cell publication limit; complementary disclosure assessment is outside this operation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { counts, minimum } = request;
  const compute = (): Output => {
    H.integer(minimum, 0);
    H.domain(
      counts.every((x) => x >= 0),
      "counts",
    );
    const suppressedIndices = counts.flatMap((x, i) =>
        x < minimum ? [i] : [],
      ),
      releasedIndices = counts.flatMap((x, i) => (x >= minimum ? [i] : []));
    return {
      suppressedIndices,
      releasedIndices,
      releasedCount: releasedIndices.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { counts: [2, 10, 4, 20], minimum: 5 },
  output: {
    suppressedIndices: [0, 2],
    releasedIndices: [1, 3],
    releasedCount: 2,
  },
} satisfies ToolExample<Input, Output>;
export const publicHealthDataSmallCellSuppliedLimitTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "public-health/public-health-data-small-cell-supplied-limit",
      title: "Public Health Data Small Cell Supplied Limit Tool",
      description:
        "Apply a supplied direct small-cell publication limit; complementary disclosure assessment is outside this operation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          counts: { type: "array", maxItems: 256, items: { type: "integer" } },
          minimum: { type: "integer", minimum: 0 },
        },
        required: ["counts", "minimum"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          suppressedIndices: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
          releasedIndices: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
          releasedCount: { type: "integer" },
        },
        required: ["suppressedIndices", "releasedIndices", "releasedCount"],
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
            id: "minimum",
            label: "Minimum",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "suppressedIndices",
            label: "Suppressed Indices",
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "releasedIndices",
            label: "Released Indices",
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "releasedCount",
            label: "Released Count",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = publicHealthDataSmallCellSuppliedLimitTool.execute;
export default publicHealthDataSmallCellSuppliedLimitTool;
