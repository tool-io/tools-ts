import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly credits: readonly number[];
  readonly quantum: number;
};
export type Output = {
  readonly sumOfRounded: number;
  readonly roundedSum: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    credits: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    quantum: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["credits", "quantum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sumOfRounded: { type: "number" },
    roundedSum: { type: "number" },
    gap: { type: "number" },
  },
  required: ["sumOfRounded", "roundedSum", "gap"],
} as const;
/** Compare component versus total credit rounding to an explicit quantum using nearest ties toward positive infinity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { credits, quantum } = request;
  const compute = (): Output => {
    H.positive(quantum);
    H.domain(credits.every((x) => x >= 0));
    return (() => {
      const rounded = (x: number) => Math.round(x / quantum) * quantum,
        sumOfRounded = credits.reduce((s, x) => s + rounded(x), 0),
        roundedSum = rounded(credits.reduce((a, b) => a + b, 0));
      return { sumOfRounded, roundedSum, gap: sumOfRounded - roundedSum };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { credits: [0.4, 0.4], quantum: 1 },
  output: { sumOfRounded: 0, roundedSum: 1, gap: -1 },
} satisfies ToolExample<Input, Output>;
export const creditComponentRoundingGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/credit-component-rounding-gap",
    title: "Credit Component Rounding Gap Tool",
    description:
      "Compare component versus total credit rounding to an explicit quantum using nearest ties toward positive infinity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        credits: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        quantum: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["credits", "quantum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sumOfRounded: { type: "number" },
        roundedSum: { type: "number" },
        gap: { type: "number" },
      },
      required: ["sumOfRounded", "roundedSum", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "credits",
          label: "Credits",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "quantum",
          label: "Quantum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sumOfRounded",
          label: "Sum Of Rounded",
          valueType: { type: "number" },
        },
        {
          id: "roundedSum",
          label: "Rounded Sum",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = creditComponentRoundingGapTool.execute;
export default creditComponentRoundingGapTool;
