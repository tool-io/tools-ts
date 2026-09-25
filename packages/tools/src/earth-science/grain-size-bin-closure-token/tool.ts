import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly size: number;
  readonly lower: number;
  readonly upper: number;
  readonly includeLower: boolean;
  readonly includeUpper: boolean;
};
export type Output = { readonly inBin: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    size: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
    includeLower: { type: "boolean" },
    includeUpper: { type: "boolean" },
  },
  required: ["size", "lower", "upper", "includeLower", "includeUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inBin: { type: "boolean" } },
  required: ["inBin"],
} as const;
/** Apply explicit sieve-size bin endpoint conventions in one common size unit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { size, lower, upper, includeLower, includeUpper } = request;
  const compute = (): Output => {
    H.domain(lower < upper);
    return {
      inBin:
        (includeLower ? size >= lower : size > lower) &&
        (includeUpper ? size <= upper : size < upper),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    size: 2,
    lower: 1,
    upper: 2,
    includeLower: true,
    includeUpper: false,
  },
  output: { inBin: false },
} satisfies ToolExample<Input, Output>;
export const grainSizeBinClosureTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "earth-science/grain-size-bin-closure-token",
    title: "Grain Size Bin Closure Token Tool",
    description:
      "Apply explicit sieve-size bin endpoint conventions in one common size unit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        size: { type: "number" },
        lower: { type: "number" },
        upper: { type: "number" },
        includeLower: { type: "boolean" },
        includeUpper: { type: "boolean" },
      },
      required: ["size", "lower", "upper", "includeLower", "includeUpper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { inBin: { type: "boolean" } },
      required: ["inBin"],
    },
    ports: {
      inputs: [
        {
          id: "size",
          label: "Size",
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
        { id: "inBin", label: "In Bin", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = grainSizeBinClosureTokenTool.execute;
export default grainSizeBinClosureTokenTool;
