import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousActivations: number;
  readonly currentActivations: number;
};
export type Output = { readonly signedIncrement: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousActivations: { type: "integer", minimum: 0 },
    currentActivations: { type: "integer", minimum: 0 },
  },
  required: ["previousActivations", "currentActivations"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedIncrement: { type: "integer" } },
  required: ["signedIncrement"],
} as const;
/** Subtract explicit assistive-switch activation counters, preserving resets as negative differences without evaluating user ability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousActivations, currentActivations } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(previousActivations) &&
        previousActivations >= 0 &&
        previousActivations <= Number.MAX_SAFE_INTEGER,
      "previousActivations",
    ),
      previousActivations);
    (H.domain(
      Number.isSafeInteger(currentActivations) &&
        currentActivations >= 0 &&
        currentActivations <= Number.MAX_SAFE_INTEGER,
      "currentActivations",
    ),
      currentActivations);
    return { signedIncrement: currentActivations - previousActivations };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousActivations: 100, currentActivations: 125 },
  output: { signedIncrement: 25 },
} satisfies ToolExample<Input, Output>;
export const assistiveSwitchActivationCountDeltaTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["disability-studies", "disability studies", "social sciences"],
        keywords: ["disability studies", "social sciences"],
      },
      id: "disability-studies/assistive-switch-activation-count-delta",
      title: "Assistive Switch Activation Count Delta",
      description:
        "Subtract explicit assistive-switch activation counters, preserving resets as negative differences without evaluating user ability.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          previousActivations: { type: "integer", minimum: 0 },
          currentActivations: { type: "integer", minimum: 0 },
        },
        required: ["previousActivations", "currentActivations"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { signedIncrement: { type: "integer" } },
        required: ["signedIncrement"],
      },
      ports: {
        inputs: [
          {
            id: "previousActivations",
            label: "Previous Activations",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "currentActivations",
            label: "Current Activations",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "signedIncrement",
            label: "Signed Increment",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = assistiveSwitchActivationCountDeltaTool.execute;
export default assistiveSwitchActivationCountDeltaTool;
