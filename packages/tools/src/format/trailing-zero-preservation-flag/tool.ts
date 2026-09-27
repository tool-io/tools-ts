import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalToken: string;
  readonly formattedToken: string;
};
export type Output = {
  readonly originalFractionalTrailingZeros: number;
  readonly formattedFractionalTrailingZeros: number;
  readonly allRetained: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalToken: { type: "string", maxLength: 8192 },
    formattedToken: { type: "string", maxLength: 8192 },
  },
  required: ["originalToken", "formattedToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalFractionalTrailingZeros: { type: "integer" },
    formattedFractionalTrailingZeros: { type: "integer" },
    allRetained: { type: "boolean" },
  },
  required: [
    "originalFractionalTrailingZeros",
    "formattedFractionalTrailingZeros",
    "allRetained",
  ],
} as const;
/** Compare fractional trailing-zero counts of two supplied decimal spellings; does not certify numeric equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalToken, formattedToken } = request;
  const compute = (): Output => {
    const count = (s: string) => {
      const m = /^[+-]?\d+(?:\.(\d+))?(?![\s\S])/.exec(s);
      H.domain(m);
      return ((m[1] ?? "").match(/0+(?![\s\S])/)?.[0] ?? "").length;
    };
    const originalFractionalTrailingZeros = count(originalToken),
      formattedFractionalTrailingZeros = count(formattedToken);
    return {
      originalFractionalTrailingZeros,
      formattedFractionalTrailingZeros,
      allRetained:
        formattedFractionalTrailingZeros >= originalFractionalTrailingZeros,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { originalToken: "1.200", formattedToken: "1.20" },
  output: {
    originalFractionalTrailingZeros: 2,
    formattedFractionalTrailingZeros: 1,
    allRetained: false,
  },
} satisfies ToolExample<Input, Output>;
export const trailingZeroPreservationFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/trailing-zero-preservation-flag",
    title: "Trailing Zero Preservation Flag Tool",
    description:
      "Compare fractional trailing-zero counts of two supplied decimal spellings; does not certify numeric equivalence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalToken: { type: "string", maxLength: 8192 },
        formattedToken: { type: "string", maxLength: 8192 },
      },
      required: ["originalToken", "formattedToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalFractionalTrailingZeros: { type: "integer" },
        formattedFractionalTrailingZeros: { type: "integer" },
        allRetained: { type: "boolean" },
      },
      required: [
        "originalFractionalTrailingZeros",
        "formattedFractionalTrailingZeros",
        "allRetained",
      ],
    },
    ports: {
      inputs: [
        {
          id: "originalToken",
          label: "Original Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "formattedToken",
          label: "Formatted Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "originalFractionalTrailingZeros",
          label: "Original Fractional Trailing Zeros",
          valueType: { type: "integer" },
        },
        {
          id: "formattedFractionalTrailingZeros",
          label: "Formatted Fractional Trailing Zeros",
          valueType: { type: "integer" },
        },
        {
          id: "allRetained",
          label: "All Retained",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = trailingZeroPreservationFlagTool.execute;
export default trailingZeroPreservationFlagTool;
