import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedProbability: number;
  readonly suppliedImpact: number;
};
export type Output = { readonly probabilityWeightedImpact: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedProbability: { type: "number", minimum: 0, maximum: 1 },
    suppliedImpact: { type: "number" },
  },
  required: ["suppliedProbability", "suppliedImpact"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { probabilityWeightedImpact: { type: "number" } },
  required: ["probabilityWeightedImpact"],
} as const;
/** Multiply an explicitly supplied risk probability by compatible impact without estimating either value or claiming a full risk assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedProbability, suppliedImpact } = request;
  const compute = (): Output => {
    (H.domain(
      suppliedProbability >= 0 && suppliedProbability <= 1,
      "suppliedProbability",
    ),
      suppliedProbability);
    return { probabilityWeightedImpact: suppliedProbability * suppliedImpact };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedProbability: 0.25, suppliedImpact: 1000 },
  output: { probabilityWeightedImpact: 250 },
} satisfies ToolExample<Input, Output>;
export const projectRiskExplicitImpactProductTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["management", "business and finance"],
      keywords: ["management", "business and finance"],
    },
    id: "management/project-risk-explicit-impact-product",
    title: "Project Risk Explicit Impact Product",
    description:
      "Multiply an explicitly supplied risk probability by compatible impact without estimating either value or claiming a full risk assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedProbability: { type: "number", minimum: 0, maximum: 1 },
        suppliedImpact: { type: "number" },
      },
      required: ["suppliedProbability", "suppliedImpact"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { probabilityWeightedImpact: { type: "number" } },
      required: ["probabilityWeightedImpact"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedProbability",
          label: "Supplied Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedImpact",
          label: "Supplied Impact",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "probabilityWeightedImpact",
          label: "Probability Weighted Impact",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = projectRiskExplicitImpactProductTool.execute;
export default projectRiskExplicitImpactProductTool;
