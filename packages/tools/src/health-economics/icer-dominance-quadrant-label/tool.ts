import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly incrementalCost: number;
  readonly incrementalEffect: number;
};
export type Output = {
  readonly classification: string;
  readonly icer: number;
  readonly ratioDefined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    incrementalCost: { type: "number" },
    incrementalEffect: {
      type: "number",
      description:
        "Incremental beneficial effect on a common scale; positive means more health benefit.",
    },
  },
  required: ["incrementalCost", "incrementalEffect"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    classification: { type: "string", maxLength: 8192 },
    icer: { type: "number" },
    ratioDefined: { type: "boolean" },
  },
  required: ["classification", "icer", "ratioDefined"],
} as const;
/** Label strict cost/effect dominance, tradeoff quadrants, and explicit equal-cost or equal-effect boundaries, with an ICER only for nonzero incremental effect. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { incrementalCost, incrementalEffect } = request;
  const compute = (): Output => {
    return {
      classification:
        incrementalCost === 0 && incrementalEffect === 0
          ? "no difference"
          : incrementalCost < 0 && incrementalEffect > 0
            ? "dominant"
            : incrementalCost > 0 && incrementalEffect < 0
              ? "dominated"
              : incrementalCost > 0 && incrementalEffect > 0
                ? "more costly and more effective"
                : incrementalCost < 0 && incrementalEffect < 0
                  ? "less costly and less effective"
                  : incrementalCost === 0
                    ? incrementalEffect > 0
                      ? "equal cost, effect gain"
                      : "equal cost, effect loss"
                    : incrementalCost < 0
                      ? "cost saving, equal effect"
                      : "extra cost, equal effect",
      icer: incrementalEffect !== 0 ? incrementalCost / incrementalEffect : 0,
      ratioDefined: incrementalEffect !== 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { incrementalCost: -100, incrementalEffect: 0.2 },
  output: { classification: "dominant", icer: -500, ratioDefined: true },
} satisfies ToolExample<Input, Output>;
export const icerDominanceQuadrantLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["health-economics", "health economics", "economics"],
      keywords: ["health economics", "economics"],
    },
    id: "health-economics/icer-dominance-quadrant-label",
    title: "ICER Dominance Quadrant Label",
    description:
      "Label strict cost/effect dominance, tradeoff quadrants, and explicit equal-cost or equal-effect boundaries, with an ICER only for nonzero incremental effect.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        incrementalCost: { type: "number" },
        incrementalEffect: {
          type: "number",
          description:
            "Incremental beneficial effect on a common scale; positive means more health benefit.",
        },
      },
      required: ["incrementalCost", "incrementalEffect"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        classification: { type: "string", maxLength: 8192 },
        icer: { type: "number" },
        ratioDefined: { type: "boolean" },
      },
      required: ["classification", "icer", "ratioDefined"],
    },
    ports: {
      inputs: [
        {
          id: "incrementalCost",
          label: "Incremental Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "incrementalEffect",
          label: "Incremental Effect",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "classification",
          label: "Classification",
          valueType: { type: "string" },
        },
        { id: "icer", label: "Icer", valueType: { type: "number" } },
        {
          id: "ratioDefined",
          label: "Ratio Defined",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = icerDominanceQuadrantLabelTool.execute;
export default icerDominanceQuadrantLabelTool;
