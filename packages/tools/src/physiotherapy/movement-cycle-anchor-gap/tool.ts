import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventSample: number;
  readonly cycleStartSample: number;
  readonly samplesPerCycle: number;
  readonly suppliedAnchorPhase: number;
};
export type Output = {
  readonly phase: number;
  readonly signedAnchorGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventSample: { type: "integer" },
    cycleStartSample: { type: "integer" },
    samplesPerCycle: { type: "integer", minimum: 1 },
    suppliedAnchorPhase: { type: "integer", minimum: 0 },
  },
  required: [
    "eventSample",
    "cycleStartSample",
    "samplesPerCycle",
    "suppliedAnchorPhase",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phase: { type: "integer" },
    signedAnchorGap: { type: "integer" },
  },
  required: ["phase", "signedAnchorGap"],
} as const;
/** Calculate movement cycle anchor gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    eventSample,
    cycleStartSample,
    samplesPerCycle,
    suppliedAnchorPhase,
  } = request;
  const compute = (): Output => {
    H.integer(samplesPerCycle, 1);
    H.integer(suppliedAnchorPhase, 0, samplesPerCycle - 1);
    return (() => {
      const n = BigInt(samplesPerCycle),
        p = Number(
          (((BigInt(eventSample) - BigInt(cycleStartSample)) % n) + n) % n,
        ),
        d = p - suppliedAnchorPhase;
      return {
        phase: p,
        signedAnchorGap:
          d > samplesPerCycle / 2
            ? d - samplesPerCycle
            : d < -samplesPerCycle / 2
              ? d + samplesPerCycle
              : d,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eventSample: 12,
    cycleStartSample: 3,
    samplesPerCycle: 10,
    suppliedAnchorPhase: 1,
  },
  output: { phase: 9, signedAnchorGap: -2 },
} satisfies ToolExample<Input, Output>;
export const movementCycleAnchorGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiotherapy/movement-cycle-anchor-gap",
    title: "Movement Cycle Anchor Gap Tool",
    description:
      "Calculate movement cycle anchor gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventSample: { type: "integer" },
        cycleStartSample: { type: "integer" },
        samplesPerCycle: { type: "integer", minimum: 1 },
        suppliedAnchorPhase: { type: "integer", minimum: 0 },
      },
      required: [
        "eventSample",
        "cycleStartSample",
        "samplesPerCycle",
        "suppliedAnchorPhase",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phase: { type: "integer" },
        signedAnchorGap: { type: "integer" },
      },
      required: ["phase", "signedAnchorGap"],
    },
    ports: {
      inputs: [
        {
          id: "eventSample",
          label: "Event Sample",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cycleStartSample",
          label: "Cycle Start Sample",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "samplesPerCycle",
          label: "Samples Per Cycle",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedAnchorPhase",
          label: "Supplied Anchor Phase",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "phase", label: "Phase", valueType: { type: "integer" } },
        {
          id: "signedAnchorGap",
          label: "Signed Anchor Gap",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = movementCycleAnchorGapTool.execute;
export default movementCycleAnchorGapTool;
