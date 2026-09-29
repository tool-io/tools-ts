import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly values: readonly number[];
  readonly lower: number;
  readonly upper: number;
  readonly lowerIncluded: boolean;
  readonly upperIncluded: boolean;
};
export type Output = {
  readonly inside: number;
  readonly onLower: number;
  readonly onUpper: number;
  readonly outside: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: { type: "array", maxItems: 256, items: { type: "number" } },
    lower: { type: "number" },
    upper: { type: "number" },
    lowerIncluded: { type: "boolean" },
    upperIncluded: { type: "boolean" },
  },
  required: ["values", "lower", "upper", "lowerIncluded", "upperIncluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inside: { type: "integer" },
    onLower: { type: "integer" },
    onUpper: { type: "integer" },
    outside: { type: "integer" },
  },
  required: ["inside", "onLower", "onUpper", "outside"],
} as const;
/** Count one-dimensional research gate membership under explicit boundary inclusion flags. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { values, lower, upper, lowerIncluded, upperIncluded } = request;
  const compute = (): Output => {
    H.domain(upper >= lower);
    return (() => {
      const inside = values.filter(
        (x) =>
          (lowerIncluded ? x >= lower : x > lower) &&
          (upperIncluded ? x <= upper : x < upper),
      ).length;
      return {
        inside,
        onLower: values.filter((x) => x === lower).length,
        onUpper: values.filter((x) => x === upper).length,
        outside: values.length - inside,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    values: [0, 1, 2, 3],
    lower: 1,
    upper: 2,
    lowerIncluded: true,
    upperIncluded: false,
  },
  output: { inside: 1, onLower: 1, onUpper: 1, outside: 3 },
} satisfies ToolExample<Input, Output>;
export const flowGateBoundaryCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "immunology/flow-gate-boundary-count",
    title: "Flow Gate Boundary Count Tool",
    description:
      "Count one-dimensional research gate membership under explicit boundary inclusion flags.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        values: { type: "array", maxItems: 256, items: { type: "number" } },
        lower: { type: "number" },
        upper: { type: "number" },
        lowerIncluded: { type: "boolean" },
        upperIncluded: { type: "boolean" },
      },
      required: ["values", "lower", "upper", "lowerIncluded", "upperIncluded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inside: { type: "integer" },
        onLower: { type: "integer" },
        onUpper: { type: "integer" },
        outside: { type: "integer" },
      },
      required: ["inside", "onLower", "onUpper", "outside"],
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
          id: "lower",
          label: "Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upper",
          label: "Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerIncluded",
          label: "Lower Included",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "upperIncluded",
          label: "Upper Included",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "inside", label: "Inside", valueType: { type: "integer" } },
        { id: "onLower", label: "On Lower", valueType: { type: "integer" } },
        { id: "onUpper", label: "On Upper", valueType: { type: "integer" } },
        { id: "outside", label: "Outside", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = flowGateBoundaryCountTool.execute;
export default flowGateBoundaryCountTool;
