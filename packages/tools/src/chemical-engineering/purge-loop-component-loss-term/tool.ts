import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly purgeFlow: number;
  readonly componentFraction: number;
};
export type Output = { readonly componentLossFlow: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    purgeFlow: { type: "number", minimum: 0 },
    componentFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["purgeFlow", "componentFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { componentLossFlow: { type: "number" } },
  required: ["componentLossFlow"],
} as const;
/** Multiply explicit purge-stream flow by component fraction on a consistent mass or amount basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { purgeFlow, componentFraction } = request;
  const compute = (): Output => {
    H.domain(purgeFlow >= 0, "purgeFlow");
    (H.domain(
      componentFraction >= 0 && componentFraction <= 1,
      "componentFraction",
    ),
      componentFraction);
    return { componentLossFlow: purgeFlow * componentFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { purgeFlow: 10, componentFraction: 0.2 },
  output: { componentLossFlow: 2 },
} satisfies ToolExample<Input, Output>;
export const purgeLoopComponentLossTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["chemical-engineering", "chemical engineering", "engineering"],
      keywords: ["chemical engineering", "engineering"],
    },
    id: "chemical-engineering/purge-loop-component-loss-term",
    title: "Purge Loop Component Loss Term",
    description:
      "Multiply explicit purge-stream flow by component fraction on a consistent mass or amount basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        purgeFlow: { type: "number", minimum: 0 },
        componentFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["purgeFlow", "componentFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { componentLossFlow: { type: "number" } },
      required: ["componentLossFlow"],
    },
    ports: {
      inputs: [
        {
          id: "purgeFlow",
          label: "Purge Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "componentFraction",
          label: "Component Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "componentLossFlow",
          label: "Component Loss Flow",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = purgeLoopComponentLossTermTool.execute;
export default purgeLoopComponentLossTermTool;
