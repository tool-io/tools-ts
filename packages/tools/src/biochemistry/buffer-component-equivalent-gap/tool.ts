import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amounts: readonly number[];
  readonly suppliedEquivalentFactors: readonly number[];
  readonly targetEquivalents: number;
};
export type Output = {
  readonly totalEquivalents: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amounts: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    suppliedEquivalentFactors: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    targetEquivalents: { type: "number" },
  },
  required: ["amounts", "suppliedEquivalentFactors", "targetEquivalents"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { totalEquivalents: { type: "number" }, gap: { type: "number" } },
  required: ["totalEquivalents", "gap"],
} as const;
/** Balance caller-supplied signed equivalent factors; no pH, species equilibrium or buffer recipe is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amounts, suppliedEquivalentFactors, targetEquivalents } = request;
  const compute = (): Output => {
    H.sameLength(amounts, suppliedEquivalentFactors);
    H.domain(amounts.every((x) => x >= 0));
    return (() => {
      const totalEquivalents = amounts.reduce(
        (s, x, i) => s + x * suppliedEquivalentFactors[i],
        0,
      );
      return { totalEquivalents, gap: totalEquivalents - targetEquivalents };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    amounts: [2, 3],
    suppliedEquivalentFactors: [1, -1],
    targetEquivalents: 0,
  },
  output: { totalEquivalents: -1, gap: -1 },
} satisfies ToolExample<Input, Output>;
export const bufferComponentEquivalentGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biochemistry/buffer-component-equivalent-gap",
    title: "Buffer Component Equivalent Gap Tool",
    description:
      "Balance caller-supplied signed equivalent factors; no pH, species equilibrium or buffer recipe is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amounts: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        suppliedEquivalentFactors: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        targetEquivalents: { type: "number" },
      },
      required: ["amounts", "suppliedEquivalentFactors", "targetEquivalents"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalEquivalents: { type: "number" },
        gap: { type: "number" },
      },
      required: ["totalEquivalents", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "amounts",
          label: "Amounts",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "suppliedEquivalentFactors",
          label: "Supplied Equivalent Factors",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "targetEquivalents",
          label: "Target Equivalents",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalEquivalents",
          label: "Total Equivalents",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = bufferComponentEquivalentGapTool.execute;
export default bufferComponentEquivalentGapTool;
