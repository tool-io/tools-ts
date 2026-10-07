import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredMatch: number;
  readonly securedMatch: number;
};
export type Output = { readonly shortfall: number; readonly surplus: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredMatch: { type: "number", minimum: 0 },
    securedMatch: { type: "number", minimum: 0 },
  },
  required: ["requiredMatch", "securedMatch"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { shortfall: { type: "number" }, surplus: { type: "number" } },
  required: ["shortfall", "surplus"],
} as const;
/** Compare explicit required and secured neighborhood project matching amounts without selecting funding policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredMatch, securedMatch } = request;
  const compute = (): Output => {
    H.domain(requiredMatch >= 0, "requiredMatch");
    H.domain(securedMatch >= 0, "securedMatch");
    return {
      shortfall: Math.max(0, requiredMatch - securedMatch),
      surplus: Math.max(0, securedMatch - requiredMatch),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requiredMatch: 100, securedMatch: 75 },
  output: { shortfall: 25, surplus: 0 },
} satisfies ToolExample<Input, Output>;
export const neighborhoodProjectMatchShortfallTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "community-development",
        "community development",
        "social sciences",
      ],
      keywords: ["community development", "social sciences"],
    },
    id: "community-development/neighborhood-project-match-shortfall",
    title: "Neighborhood Project Match Shortfall",
    description:
      "Compare explicit required and secured neighborhood project matching amounts without selecting funding policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredMatch: { type: "number", minimum: 0 },
        securedMatch: { type: "number", minimum: 0 },
      },
      required: ["requiredMatch", "securedMatch"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shortfall: { type: "number" },
        surplus: { type: "number" },
      },
      required: ["shortfall", "surplus"],
    },
    ports: {
      inputs: [
        {
          id: "requiredMatch",
          label: "Required Match",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "securedMatch",
          label: "Secured Match",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "shortfall", label: "Shortfall", valueType: { type: "number" } },
        { id: "surplus", label: "Surplus", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = neighborhoodProjectMatchShortfallTool.execute;
export default neighborhoodProjectMatchShortfallTool;
