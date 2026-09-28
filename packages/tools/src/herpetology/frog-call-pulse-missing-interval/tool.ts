import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedPulses: number;
  readonly expectedSlots: number;
  readonly uncertainSlots: number;
  readonly includeUncertain: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly missingSlots: number;
  readonly coverage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedPulses: { type: "integer", minimum: 0 },
    expectedSlots: { type: "integer", minimum: 1 },
    uncertainSlots: { type: "integer", minimum: 0 },
    includeUncertain: { type: "boolean" },
  },
  required: [
    "observedPulses",
    "expectedSlots",
    "uncertainSlots",
    "includeUncertain",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    missingSlots: { type: "integer" },
    coverage: { type: "number" },
  },
  required: ["denominator", "missingSlots", "coverage"],
} as const;
/** Calculate frog call pulse missing interval from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedPulses, expectedSlots, uncertainSlots, includeUncertain } =
    request;
  const compute = (): Output => {
    H.integer(expectedSlots, 1);
    H.integer(uncertainSlots, 0, expectedSlots);
    H.domain(expectedSlots - (includeUncertain ? 0 : uncertainSlots) > 0);
    H.integer(observedPulses, 0, expectedSlots - uncertainSlots);
    return {
      denominator: expectedSlots - (includeUncertain ? 0 : uncertainSlots),
      missingSlots:
        expectedSlots -
        (includeUncertain ? 0 : uncertainSlots) -
        observedPulses,
      coverage:
        observedPulses /
        (expectedSlots - (includeUncertain ? 0 : uncertainSlots)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedPulses: 8,
    expectedSlots: 12,
    uncertainSlots: 2,
    includeUncertain: false,
  },
  output: { denominator: 10, missingSlots: 2, coverage: 0.8 },
} satisfies ToolExample<Input, Output>;
export const frogCallPulseMissingIntervalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "herpetology/frog-call-pulse-missing-interval",
    title: "Frog Call Pulse Missing Interval Tool",
    description:
      "Calculate frog call pulse missing interval from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedPulses: { type: "integer", minimum: 0 },
        expectedSlots: { type: "integer", minimum: 1 },
        uncertainSlots: { type: "integer", minimum: 0 },
        includeUncertain: { type: "boolean" },
      },
      required: [
        "observedPulses",
        "expectedSlots",
        "uncertainSlots",
        "includeUncertain",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        missingSlots: { type: "integer" },
        coverage: { type: "number" },
      },
      required: ["denominator", "missingSlots", "coverage"],
    },
    ports: {
      inputs: [
        {
          id: "observedPulses",
          label: "Observed Pulses",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "expectedSlots",
          label: "Expected Slots",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "uncertainSlots",
          label: "Uncertain Slots",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeUncertain",
          label: "Include Uncertain",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        {
          id: "missingSlots",
          label: "Missing Slots",
          valueType: { type: "integer" },
        },
        { id: "coverage", label: "Coverage", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = frogCallPulseMissingIntervalTool.execute;
export default frogCallPulseMissingIntervalTool;
