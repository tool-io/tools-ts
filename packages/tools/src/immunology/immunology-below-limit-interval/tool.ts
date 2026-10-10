import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedLimit: number;
  readonly nonnegativeLower: number;
  readonly strictlyBelow: boolean;
};
export type Output = {
  readonly lower: number;
  readonly upper: number;
  readonly upperIncluded: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedLimit: { type: "number" },
    nonnegativeLower: { type: "number", minimum: 0 },
    strictlyBelow: { type: "boolean" },
  },
  required: ["reportedLimit", "nonnegativeLower", "strictlyBelow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number" },
    upper: { type: "number" },
    upperIncluded: { type: "boolean" },
  },
  required: ["lower", "upper", "upperIncluded"],
} as const;
/** Represent a supplied below-limit assay interval without assigning an imputed result. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedLimit, nonnegativeLower, strictlyBelow } = request;
  const compute = (): Output => {
    H.domain(
      nonnegativeLower >= 0 && reportedLimit >= nonnegativeLower,
      "nonnegativeLower",
    );
    return {
      lower: nonnegativeLower,
      upper: reportedLimit,
      upperIncluded: !strictlyBelow,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportedLimit: 0.2, nonnegativeLower: 0, strictlyBelow: true },
  output: { lower: 0, upper: 0.2, upperIncluded: false },
} satisfies ToolExample<Input, Output>;
export const immunologyBelowLimitIntervalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["immunology", "health and medicine"],
      keywords: ["immunology", "health and medicine"],
    },
    id: "immunology/immunology-below-limit-interval",
    title: "Immunology Below Limit Interval",
    description:
      "Represent a supplied below-limit assay interval without assigning an imputed result.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedLimit: { type: "number" },
        nonnegativeLower: { type: "number", minimum: 0 },
        strictlyBelow: { type: "boolean" },
      },
      required: ["reportedLimit", "nonnegativeLower", "strictlyBelow"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lower: { type: "number" },
        upper: { type: "number" },
        upperIncluded: { type: "boolean" },
      },
      required: ["lower", "upper", "upperIncluded"],
    },
    ports: {
      inputs: [
        {
          id: "reportedLimit",
          label: "Reported Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nonnegativeLower",
          label: "Nonnegative Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "strictlyBelow",
          label: "Strictly Below",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "lower", label: "Lower", valueType: { type: "number" } },
        { id: "upper", label: "Upper", valueType: { type: "number" } },
        {
          id: "upperIncluded",
          label: "Upper Included",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = immunologyBelowLimitIntervalTool.execute;
export default immunologyBelowLimitIntervalTool;
