import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const impulseFactors = {
  detent: {
    beatsPerImpulse: 2,
    description: "one impulse per full two-beat oscillation",
  },
  duplex: {
    beatsPerImpulse: 2,
    description: "impulse on one of the two balance swings",
  },
  natural: {
    beatsPerImpulse: 1,
    description: "two impulses per full oscillation",
  },
} as const;

export type EscapementImpulseKind = keyof typeof impulseFactors;

export type EscapementImpulseRateInput = {
  readonly balanceBeatsPerHour: number;
  readonly escapement: EscapementImpulseKind;
};

export type EscapementImpulseRateOutput = {
  readonly beatsPerImpulse: number;
  readonly description: string;
  readonly impulsesPerHour: number;
};

export const calculateEscapementImpulseRate = (
  input: EscapementImpulseRateInput,
): EscapementImpulseRateOutput => {
  if (
    !Number.isSafeInteger(input.balanceBeatsPerHour) ||
    input.balanceBeatsPerHour < 1
  )
    simpleError(
      "balanceBeatsPerHour",
      "Balance beats per hour must be a positive safe integer.",
      "balance_beat_rate_invalid",
    );
  const entry = impulseFactors[input.escapement];
  if (entry === undefined)
    simpleError(
      "escapement",
      "Escapement is not supported.",
      "unsupported_escapement",
    );
  return {
    beatsPerImpulse: entry.beatsPerImpulse,
    description: entry.description,
    impulsesPerHour: input.balanceBeatsPerHour / entry.beatsPerImpulse,
  };
};

export const escapementImpulseRateExample = {
  input: { balanceBeatsPerHour: 18_000, escapement: "detent" },
  output: {
    beatsPerImpulse: 2,
    description: "one impulse per full two-beat oscillation",
    impulsesPerHour: 9000,
  },
} satisfies ToolExample<
  EscapementImpulseRateInput,
  EscapementImpulseRateOutput
>;

export const escapementImpulseRateTool = createSimpleTool({
  calculate: (input) =>
    calculateEscapementImpulseRate({
      balanceBeatsPerHour: input.balanceBeatsPerHour as number,
      escapement: input.escapement as EscapementImpulseKind,
    }),
  description:
    "Compare detent, duplex, and natural-escapement impulse rates from the balance beat rate without conflating beat and full oscillation.",
  id: "horology/escapement-impulse-rate",
  inputs: [
    {
      id: "balanceBeatsPerHour",
      kind: "integer",
      label: "Balance beats per hour",
      minimum: 1,
    },
    {
      enum: ["detent", "duplex", "natural"],
      id: "escapement",
      kind: "string",
      label: "Escapement impulse pattern",
    },
  ],
  outputs: [
    {
      id: "beatsPerImpulse",
      kind: "number",
      label: "Beats per impulse",
      minimum: 1,
    },
    { id: "description", kind: "string", label: "Impulse pattern" },
    {
      id: "impulsesPerHour",
      kind: "number",
      label: "Impulses per hour",
      minimum: 0.5,
    },
  ],
  title: "Escapement Impulse Rate",
});

export const runEscapementImpulseRate = escapementImpulseRateTool.execute;
export default escapementImpulseRateTool;
