import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly characters: number;
  readonly targetCharactersPerSecond: number;
  readonly availableSeconds: number;
};
export type Output = {
  readonly neededSeconds: number;
  readonly remainingSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    characters: { type: "integer", minimum: 0 },
    targetCharactersPerSecond: { type: "number", exclusiveMinimum: 0 },
    availableSeconds: { type: "number", minimum: 0 },
  },
  required: ["characters", "targetCharactersPerSecond", "availableSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    neededSeconds: { type: "number" },
    remainingSeconds: { type: "number" },
  },
  required: ["neededSeconds", "remainingSeconds"],
} as const;
/** Calculate accessible consent caption duration budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { characters, targetCharactersPerSecond, availableSeconds } = request;
  const compute = (): Output => {
    H.integer(characters, 0);
    H.positive(targetCharactersPerSecond);
    H.domain(availableSeconds >= 0);
    return {
      neededSeconds: characters / targetCharactersPerSecond,
      remainingSeconds:
        availableSeconds - characters / targetCharactersPerSecond,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    characters: 120,
    targetCharactersPerSecond: 15,
    availableSeconds: 10,
  },
  output: { neededSeconds: 8, remainingSeconds: 2 },
} satisfies ToolExample<Input, Output>;
export const accessibleConsentCaptionDurationBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioethics/accessible-consent-caption-duration-budget",
      title: "Accessible Consent Caption Duration Budget Tool",
      description:
        "Calculate accessible consent caption duration budget from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          characters: { type: "integer", minimum: 0 },
          targetCharactersPerSecond: { type: "number", exclusiveMinimum: 0 },
          availableSeconds: { type: "number", minimum: 0 },
        },
        required: [
          "characters",
          "targetCharactersPerSecond",
          "availableSeconds",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          neededSeconds: { type: "number" },
          remainingSeconds: { type: "number" },
        },
        required: ["neededSeconds", "remainingSeconds"],
      },
      ports: {
        inputs: [
          {
            id: "characters",
            label: "Characters",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "targetCharactersPerSecond",
            label: "Target Characters Per Second",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "availableSeconds",
            label: "Available Seconds",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "neededSeconds",
            label: "Needed Seconds",
            valueType: { type: "number" },
          },
          {
            id: "remainingSeconds",
            label: "Remaining Seconds",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = accessibleConsentCaptionDurationBudgetTool.execute;
export default accessibleConsentCaptionDurationBudgetTool;
