import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grantAmount: number;
  readonly requiredMatchFraction: number;
  readonly availableMatch: number;
};
export type Output = {
  readonly requiredMatch: number;
  readonly shortfall: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grantAmount: { type: "number", minimum: 0 },
    requiredMatchFraction: { type: "number", minimum: 0 },
    availableMatch: { type: "number", minimum: 0 },
  },
  required: ["grantAmount", "requiredMatchFraction", "availableMatch"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredMatch: { type: "number" },
    shortfall: { type: "number" },
  },
  required: ["requiredMatch", "shortfall"],
} as const;
/** Compare available cofinancing with a match expressed explicitly as a fraction of the grant, rather than a share of total project cost. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grantAmount, requiredMatchFraction, availableMatch } = request;
  const compute = (): Output => {
    H.domain(
      grantAmount >= 0 && requiredMatchFraction >= 0 && availableMatch >= 0,
      "grantAmount",
    );
    return {
      requiredMatch: grantAmount * requiredMatchFraction,
      shortfall: Math.max(
        0,
        grantAmount * requiredMatchFraction - availableMatch,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grantAmount: 10000,
    requiredMatchFraction: 0.25,
    availableMatch: 1500,
  },
  output: { requiredMatch: 2500, shortfall: 1000 },
} satisfies ToolExample<Input, Output>;
export const grantCofinancingShortfallTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/grant-cofinancing-shortfall",
    title: "Grant Cofinancing Shortfall Tool",
    description:
      "Compare available cofinancing with a match expressed explicitly as a fraction of the grant, rather than a share of total project cost.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grantAmount: { type: "number", minimum: 0 },
        requiredMatchFraction: { type: "number", minimum: 0 },
        availableMatch: { type: "number", minimum: 0 },
      },
      required: ["grantAmount", "requiredMatchFraction", "availableMatch"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredMatch: { type: "number" },
        shortfall: { type: "number" },
      },
      required: ["requiredMatch", "shortfall"],
    },
    ports: {
      inputs: [
        {
          id: "grantAmount",
          label: "Grant Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredMatchFraction",
          label: "Required Match Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "availableMatch",
          label: "Available Match",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "requiredMatch",
          label: "Required Match",
          valueType: { type: "number" },
        },
        { id: "shortfall", label: "Shortfall", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = grantCofinancingShortfallTool.execute;
export default grantCofinancingShortfallTool;
