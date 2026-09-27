import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly latency: number;
  readonly lower: number;
  readonly upper: number;
  readonly includeLower: boolean;
  readonly includeUpper: boolean;
};
export type Output = {
  readonly included: boolean;
  readonly onBoundary: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    latency: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
    includeLower: { type: "boolean" },
    includeUpper: { type: "boolean" },
  },
  required: ["latency", "lower", "upper", "includeLower", "includeUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    included: { type: "boolean" },
    onBoundary: { type: "boolean" },
  },
  required: ["included", "onBoundary"],
} as const;
/** Apply explicitly supplied research inclusion boundaries, not an inferred exclusion threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { latency, lower, upper, includeLower, includeUpper } = request;
  const compute = (): Output => {
    H.domain(lower <= upper);
    return {
      included:
        (includeLower ? latency >= lower : latency > lower) &&
        (includeUpper ? latency <= upper : latency < upper),
      onBoundary: latency === lower || latency === upper,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    latency: 100,
    lower: 100,
    upper: 500,
    includeLower: false,
    includeUpper: true,
  },
  output: { included: false, onBoundary: true },
} satisfies ToolExample<Input, Output>;
export const trialExclusionBoundaryFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/trial-exclusion-boundary-flag",
    title: "Trial Exclusion Boundary Flag Tool",
    description:
      "Apply explicitly supplied research inclusion boundaries, not an inferred exclusion threshold.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        latency: { type: "number" },
        lower: { type: "number" },
        upper: { type: "number" },
        includeLower: { type: "boolean" },
        includeUpper: { type: "boolean" },
      },
      required: ["latency", "lower", "upper", "includeLower", "includeUpper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        included: { type: "boolean" },
        onBoundary: { type: "boolean" },
      },
      required: ["included", "onBoundary"],
    },
    ports: {
      inputs: [
        {
          id: "latency",
          label: "Latency",
          required: true,
          valueType: { type: "number" },
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
          id: "includeLower",
          label: "Include Lower",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeUpper",
          label: "Include Upper",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "included", label: "Included", valueType: { type: "boolean" } },
        {
          id: "onBoundary",
          label: "On Boundary",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = trialExclusionBoundaryFlagTool.execute;
export default trialExclusionBoundaryFlagTool;
