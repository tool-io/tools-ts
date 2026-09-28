import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly raw: number;
  readonly deadAnchor: number;
  readonly fullHealthAnchor: number;
};
export type Output = { readonly utility: number; readonly belowDeath: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    raw: { type: "number" },
    deadAnchor: { type: "number" },
    fullHealthAnchor: { type: "number" },
  },
  required: ["raw", "deadAnchor", "fullHealthAnchor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { utility: { type: "number" }, belowDeath: { type: "boolean" } },
  required: ["utility", "belowDeath"],
} as const;
/** Affine rescaling of an explicitly supplied utility scale; not a mapping from a questionnaire or a validated health-utility tariff. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { raw, deadAnchor, fullHealthAnchor } = request;
  const compute = (): Output => {
    H.domain(fullHealthAnchor !== deadAnchor);
    return {
      utility: (raw - deadAnchor) / (fullHealthAnchor - deadAnchor),
      belowDeath: (raw - deadAnchor) / (fullHealthAnchor - deadAnchor) < 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { raw: 70, deadAnchor: 20, fullHealthAnchor: 120 },
  output: { utility: 0.5, belowDeath: false },
} satisfies ToolExample<Input, Output>;
export const healthUtilityDeathAnchorRescaleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-economics/health-utility-death-anchor-rescale",
    title: "Health Utility Death Anchor Rescale Tool",
    description:
      "Affine rescaling of an explicitly supplied utility scale; not a mapping from a questionnaire or a validated health-utility tariff.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        raw: { type: "number" },
        deadAnchor: { type: "number" },
        fullHealthAnchor: { type: "number" },
      },
      required: ["raw", "deadAnchor", "fullHealthAnchor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        utility: { type: "number" },
        belowDeath: { type: "boolean" },
      },
      required: ["utility", "belowDeath"],
    },
    ports: {
      inputs: [
        {
          id: "raw",
          label: "Raw",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deadAnchor",
          label: "Dead Anchor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fullHealthAnchor",
          label: "Full Health Anchor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "utility", label: "Utility", valueType: { type: "number" } },
        {
          id: "belowDeath",
          label: "Below Death",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = healthUtilityDeathAnchorRescaleTool.execute;
export default healthUtilityDeathAnchorRescaleTool;
