import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sample: number;
  readonly cycleStart: number;
  readonly samplesPerCycle: number;
  readonly boundaryToNext: boolean;
};
export type Output = { readonly cycle: number; readonly phaseSamples: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sample: { type: "integer" },
    cycleStart: { type: "integer" },
    samplesPerCycle: { type: "integer", minimum: 1 },
    boundaryToNext: { type: "boolean" },
  },
  required: ["sample", "cycleStart", "samplesPerCycle", "boundaryToNext"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cycle: { type: "integer" }, phaseSamples: { type: "integer" } },
  required: ["cycle", "phaseSamples"],
} as const;
/** Partition supplied periodic voice-trace sample indices with explicit exact-boundary ownership. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sample, cycleStart, samplesPerCycle, boundaryToNext } = request;
  const compute = (): Output => {
    H.integer(samplesPerCycle, 1);
    const delta = BigInt(sample) - BigInt(cycleStart),
      period = BigInt(samplesPerCycle);
    let q = delta / period,
      r = delta % period;
    if (r < 0n) {
      q--;
      r += period;
    }
    if (r === 0n && !boundaryToNext) {
      q--;
      r = period;
    }
    return { cycle: Number(q), phaseSamples: Number(r) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sample: 20,
    cycleStart: 0,
    samplesPerCycle: 10,
    boundaryToNext: true,
  },
  output: { cycle: 2, phaseSamples: 0 },
} satisfies ToolExample<Input, Output>;
export const voiceCycleBoundaryPhaseTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "otolaryngology/voice-cycle-boundary-phase-token",
    title: "Voice Cycle Boundary Phase Token Tool",
    description:
      "Partition supplied periodic voice-trace sample indices with explicit exact-boundary ownership.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sample: { type: "integer" },
        cycleStart: { type: "integer" },
        samplesPerCycle: { type: "integer", minimum: 1 },
        boundaryToNext: { type: "boolean" },
      },
      required: ["sample", "cycleStart", "samplesPerCycle", "boundaryToNext"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cycle: { type: "integer" },
        phaseSamples: { type: "integer" },
      },
      required: ["cycle", "phaseSamples"],
    },
    ports: {
      inputs: [
        {
          id: "sample",
          label: "Sample",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cycleStart",
          label: "Cycle Start",
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
          id: "boundaryToNext",
          label: "Boundary To Next",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "cycle", label: "Cycle", valueType: { type: "integer" } },
        {
          id: "phaseSamples",
          label: "Phase Samples",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = voiceCycleBoundaryPhaseTokenTool.execute;
export default voiceCycleBoundaryPhaseTokenTool;
