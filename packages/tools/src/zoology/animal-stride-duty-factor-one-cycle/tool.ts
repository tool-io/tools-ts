import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stanceSeconds: number;
  readonly swingSeconds: number;
  readonly overlapSeconds: number;
};
export type Output = {
  readonly cycleSeconds: number;
  readonly stanceDuty: number;
  readonly contactOverlapFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stanceSeconds: { type: "number", minimum: 0 },
    swingSeconds: { type: "number", minimum: 0 },
    overlapSeconds: { type: "number", minimum: 0 },
  },
  required: ["stanceSeconds", "swingSeconds", "overlapSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cycleSeconds: { type: "number" },
    stanceDuty: { type: "number" },
    contactOverlapFraction: { type: "number" },
  },
  required: ["cycleSeconds", "stanceDuty", "contactOverlapFraction"],
} as const;
/** One limb stance/swing duty factor with an explicitly supplied simultaneous-contact duration, without gait classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stanceSeconds, swingSeconds, overlapSeconds } = request;
  const compute = (): Output => {
    H.domain(
      stanceSeconds >= 0 &&
        swingSeconds >= 0 &&
        stanceSeconds + swingSeconds > 0 &&
        overlapSeconds >= 0 &&
        overlapSeconds <= stanceSeconds + swingSeconds,
    );
    return {
      cycleSeconds: stanceSeconds + swingSeconds,
      stanceDuty: stanceSeconds / (stanceSeconds + swingSeconds),
      contactOverlapFraction: overlapSeconds / (stanceSeconds + swingSeconds),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stanceSeconds: 0.6, swingSeconds: 0.4, overlapSeconds: 0.2 },
  output: { cycleSeconds: 1, stanceDuty: 0.6, contactOverlapFraction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const animalStrideDutyFactorOneCycleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/animal-stride-duty-factor-one-cycle",
    title: "Animal Stride Duty Factor One Cycle Tool",
    description:
      "One limb stance/swing duty factor with an explicitly supplied simultaneous-contact duration, without gait classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stanceSeconds: { type: "number", minimum: 0 },
        swingSeconds: { type: "number", minimum: 0 },
        overlapSeconds: { type: "number", minimum: 0 },
      },
      required: ["stanceSeconds", "swingSeconds", "overlapSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cycleSeconds: { type: "number" },
        stanceDuty: { type: "number" },
        contactOverlapFraction: { type: "number" },
      },
      required: ["cycleSeconds", "stanceDuty", "contactOverlapFraction"],
    },
    ports: {
      inputs: [
        {
          id: "stanceSeconds",
          label: "Stance Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "swingSeconds",
          label: "Swing Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "overlapSeconds",
          label: "Overlap Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
      ],
      outputs: [
        {
          id: "cycleSeconds",
          label: "Cycle Seconds",
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "stanceDuty",
          label: "Stance Duty",
          valueType: { type: "number" },
        },
        {
          id: "contactOverlapFraction",
          label: "Contact Overlap Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = animalStrideDutyFactorOneCycleTool.execute;
export default animalStrideDutyFactorOneCycleTool;
