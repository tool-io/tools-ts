import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requested: readonly string[];
  readonly covered: readonly string[];
  readonly excluded: readonly string[];
};
export type Output = {
  readonly coveredRequested: readonly string[];
  readonly uncovered: readonly string[];
  readonly explicitlyExcluded: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requested: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    covered: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    excluded: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requested", "covered", "excluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coveredRequested: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    uncovered: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    explicitlyExcluded: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["coveredRequested", "uncovered", "explicitlyExcluded"],
} as const;
/** Audit explicitly supplied assay-coverage IDs without predicting assay sensitivity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requested, covered, excluded } = request;
  const compute = (): Output => {
    H.domain(new Set(requested).size === requested.length);
    return {
      coveredRequested: requested.filter(
        (x) => covered.includes(x) && !excluded.includes(x),
      ),
      uncovered: requested.filter((x) => !covered.includes(x)),
      explicitlyExcluded: requested.filter((x) => excluded.includes(x)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requested: ["A", "B", "C"], covered: ["A", "B"], excluded: ["B"] },
  output: {
    coveredRequested: ["A"],
    uncovered: ["C"],
    explicitlyExcluded: ["B"],
  },
} satisfies ToolExample<Input, Output>;
export const pharmacogenomicAssayCoveredVariantCheckTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacogenomics/pharmacogenomic-assay-covered-variant-check",
      title: "Pharmacogenomic Assay Covered Variant Check Tool",
      description:
        "Audit explicitly supplied assay-coverage IDs without predicting assay sensitivity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          requested: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          covered: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          excluded: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["requested", "covered", "excluded"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coveredRequested: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          uncovered: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          explicitlyExcluded: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["coveredRequested", "uncovered", "explicitlyExcluded"],
      },
      ports: {
        inputs: [
          {
            id: "requested",
            label: "Requested",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "covered",
            label: "Covered",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "excluded",
            label: "Excluded",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "coveredRequested",
            label: "Covered Requested",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "uncovered",
            label: "Uncovered",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "explicitlyExcluded",
            label: "Explicitly Excluded",
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = pharmacogenomicAssayCoveredVariantCheckTool.execute;
export default pharmacogenomicAssayCoveredVariantCheckTool;
