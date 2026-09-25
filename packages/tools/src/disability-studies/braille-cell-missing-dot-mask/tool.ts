import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expectedDots: readonly number[];
  readonly observedDots: readonly number[];
};
export type Output = {
  readonly missingDots: readonly number[];
  readonly extraDots: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedDots: { type: "array", maxItems: 256, items: { type: "integer" } },
    observedDots: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["expectedDots", "observedDots"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingDots: { type: "array", maxItems: 256, items: { type: "integer" } },
    extraDots: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["missingDots", "extraDots"],
} as const;
/** Compare supplied six/eight-dot cell positions without translating Braille or assuming an encoding table. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expectedDots, observedDots } = request;
  const compute = (): Output => {
    H.domain([...expectedDots, ...observedDots].every((x) => x >= 1 && x <= 8));
    const expected = [...new Set(expectedDots)],
      observed = [...new Set(observedDots)];
    return {
      missingDots: expected.filter((x) => !observed.includes(x)),
      extraDots: observed.filter((x) => !expected.includes(x)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { expectedDots: [1, 2, 4], observedDots: [1, 4, 5] },
  output: { missingDots: [2], extraDots: [5] },
} satisfies ToolExample<Input, Output>;
export const brailleCellMissingDotMaskTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "disability-studies/braille-cell-missing-dot-mask",
    title: "Braille Cell Missing Dot Mask Tool",
    description:
      "Compare supplied six/eight-dot cell positions without translating Braille or assuming an encoding table.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedDots: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        observedDots: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["expectedDots", "observedDots"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missingDots: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        extraDots: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["missingDots", "extraDots"],
    },
    ports: {
      inputs: [
        {
          id: "expectedDots",
          label: "Expected Dots",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "observedDots",
          label: "Observed Dots",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "missingDots",
          label: "Missing Dots",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "extraDots",
          label: "Extra Dots",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = brailleCellMissingDotMaskTool.execute;
export default brailleCellMissingDotMaskTool;
