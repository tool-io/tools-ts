import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly values: readonly number[];
  readonly observed: readonly boolean[];
  readonly excluded: readonly boolean[];
};
export type Output = {
  readonly included: readonly number[];
  readonly missing: readonly number[];
  readonly excludedIndices: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: { type: "array", maxItems: 256, items: { type: "number" } },
    observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
    excluded: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["values", "observed", "excluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    included: { type: "array", maxItems: 256, items: { type: "integer" } },
    missing: { type: "array", maxItems: 256, items: { type: "integer" } },
    excludedIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["included", "missing", "excludedIndices"],
} as const;
/** Keep measured zeros separate from missing and explicitly excluded grid cells. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { values, observed, excluded } = request;
  const compute = (): Output => {
    H.sameLength(values, observed);
    H.sameLength(values, excluded);
    return {
      included: values.flatMap((_, i) =>
        observed[i] && !excluded[i] ? [i] : [],
      ),
      missing: values.flatMap((_, i) =>
        !observed[i] && !excluded[i] ? [i] : [],
      ),
      excludedIndices: excluded.flatMap((x, i) => (x ? [i] : [])),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    values: [1, 0, 3],
    observed: [true, false, true],
    excluded: [false, false, true],
  },
  output: { included: [0], missing: [1], excludedIndices: [2] },
} satisfies ToolExample<Input, Output>;
export const farmYieldGridMissingCellMaskTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroinformatics/farm-yield-grid-missing-cell-mask",
    title: "Farm Yield Grid Missing Cell Mask Tool",
    description:
      "Keep measured zeros separate from missing and explicitly excluded grid cells.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        values: { type: "array", maxItems: 256, items: { type: "number" } },
        observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
        excluded: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["values", "observed", "excluded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        included: { type: "array", maxItems: 256, items: { type: "integer" } },
        missing: { type: "array", maxItems: 256, items: { type: "integer" } },
        excludedIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["included", "missing", "excludedIndices"],
    },
    ports: {
      inputs: [
        {
          id: "values",
          label: "Values",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "excluded",
          label: "Excluded",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "included",
          label: "Included",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "missing",
          label: "Missing",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "excludedIndices",
          label: "Excluded Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = farmYieldGridMissingCellMaskTool.execute;
export default farmYieldGridMissingCellMaskTool;
