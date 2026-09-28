import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseMinutes: number;
  readonly interpretedFraction: number;
  readonly interpretationMultiplier: number;
  readonly setupMinutes: number;
  readonly availableMinutes: number;
};
export type Output = {
  readonly requiredMinutes: number;
  readonly slackMinutes: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseMinutes: { type: "number", minimum: 0 },
    interpretedFraction: { type: "number", minimum: 0, maximum: 1 },
    interpretationMultiplier: { type: "number", exclusiveMinimum: 0 },
    setupMinutes: { type: "number", minimum: 0 },
    availableMinutes: { type: "number", minimum: 0 },
  },
  required: [
    "baseMinutes",
    "interpretedFraction",
    "interpretationMultiplier",
    "setupMinutes",
    "availableMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredMinutes: { type: "number" },
    slackMinutes: { type: "number" },
    fits: { type: "boolean" },
  },
  required: ["requiredMinutes", "slackMinutes", "fits"],
} as const;
/** Scheduling arithmetic from explicitly supplied interpreting time assumptions, not a communication accommodation standard. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    baseMinutes,
    interpretedFraction,
    interpretationMultiplier,
    setupMinutes,
    availableMinutes,
  } = request;
  const compute = (): Output => {
    H.domain(
      baseMinutes >= 0 &&
        interpretationMultiplier > 0 &&
        setupMinutes >= 0 &&
        availableMinutes >= 0,
    );
    H.probability(interpretedFraction);
    return {
      requiredMinutes:
        baseMinutes *
          (1 -
            interpretedFraction +
            interpretedFraction * interpretationMultiplier) +
        setupMinutes,
      slackMinutes:
        availableMinutes -
        baseMinutes *
          (1 -
            interpretedFraction +
            interpretedFraction * interpretationMultiplier) -
        setupMinutes,
      fits:
        baseMinutes *
          (1 -
            interpretedFraction +
            interpretedFraction * interpretationMultiplier) +
          setupMinutes <=
        availableMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    baseMinutes: 30,
    interpretedFraction: 0.5,
    interpretationMultiplier: 2,
    setupMinutes: 5,
    availableMinutes: 60,
  },
  output: { requiredMinutes: 50, slackMinutes: 10, fits: true },
} satisfies ToolExample<Input, Output>;
export const appointmentHearingInterpretationTimeBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geriatrics/appointment-hearing-interpretation-time-budget",
      title: "Appointment Hearing Interpretation Time Budget Tool",
      description:
        "Scheduling arithmetic from explicitly supplied interpreting time assumptions, not a communication accommodation standard.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          baseMinutes: { type: "number", minimum: 0 },
          interpretedFraction: { type: "number", minimum: 0, maximum: 1 },
          interpretationMultiplier: { type: "number", exclusiveMinimum: 0 },
          setupMinutes: { type: "number", minimum: 0 },
          availableMinutes: { type: "number", minimum: 0 },
        },
        required: [
          "baseMinutes",
          "interpretedFraction",
          "interpretationMultiplier",
          "setupMinutes",
          "availableMinutes",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          requiredMinutes: { type: "number" },
          slackMinutes: { type: "number" },
          fits: { type: "boolean" },
        },
        required: ["requiredMinutes", "slackMinutes", "fits"],
      },
      ports: {
        inputs: [
          {
            id: "baseMinutes",
            label: "Base Minutes",
            required: true,
            valueType: { type: "number", unit: "min" },
          },
          {
            id: "interpretedFraction",
            label: "Interpreted Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "interpretationMultiplier",
            label: "Interpretation Multiplier",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "setupMinutes",
            label: "Setup Minutes",
            required: true,
            valueType: { type: "number", unit: "min" },
          },
          {
            id: "availableMinutes",
            label: "Available Minutes",
            required: true,
            valueType: { type: "number", unit: "min" },
          },
        ],
        outputs: [
          {
            id: "requiredMinutes",
            label: "Required Minutes",
            valueType: { type: "number", unit: "min" },
          },
          {
            id: "slackMinutes",
            label: "Slack Minutes",
            valueType: { type: "number", unit: "min" },
          },
          { id: "fits", label: "Fits", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = appointmentHearingInterpretationTimeBudgetTool.execute;
export default appointmentHearingInterpretationTimeBudgetTool;
