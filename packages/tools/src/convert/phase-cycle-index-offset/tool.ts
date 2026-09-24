import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cycleIndex: number;
  readonly offset: number;
  readonly phasesPerCycle: number;
  readonly phaseIndex: number;
};
export type Output = {
  readonly shiftedCycleDecimal: string;
  readonly shiftedPhase: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cycleIndex: { type: "integer" },
    offset: { type: "integer" },
    phasesPerCycle: { type: "integer", minimum: 1 },
    phaseIndex: { type: "integer", minimum: 0 },
  },
  required: ["cycleIndex", "offset", "phasesPerCycle", "phaseIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shiftedCycleDecimal: { type: "string", maxLength: 8192 },
    shiftedPhase: { type: "integer" },
  },
  required: ["shiftedCycleDecimal", "shiftedPhase"],
} as const;
/** Calculate phase cycle index offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cycleIndex, offset, phasesPerCycle, phaseIndex } = request;
  const compute = (): Output => {
    H.integer(phasesPerCycle, 1);
    H.integer(phaseIndex, 0, phasesPerCycle - 1);
    return (() => {
      const total =
          BigInt(cycleIndex) * BigInt(phasesPerCycle) +
          BigInt(phaseIndex) +
          BigInt(offset),
        p = BigInt(phasesPerCycle);
      let q = total / p,
        r = total % p;
      if (r < 0n) {
        q--;
        r += p;
      }
      return { shiftedCycleDecimal: q.toString(), shiftedPhase: Number(r) };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cycleIndex: 2, offset: 3, phasesPerCycle: 4, phaseIndex: 2 },
  output: { shiftedCycleDecimal: "3", shiftedPhase: 1 },
} satisfies ToolExample<Input, Output>;
export const phaseCycleIndexOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "convert/phase-cycle-index-offset",
    title: "Phase Cycle Index Offset Tool",
    description:
      "Calculate phase cycle index offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cycleIndex: { type: "integer" },
        offset: { type: "integer" },
        phasesPerCycle: { type: "integer", minimum: 1 },
        phaseIndex: { type: "integer", minimum: 0 },
      },
      required: ["cycleIndex", "offset", "phasesPerCycle", "phaseIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shiftedCycleDecimal: { type: "string", maxLength: 8192 },
        shiftedPhase: { type: "integer" },
      },
      required: ["shiftedCycleDecimal", "shiftedPhase"],
    },
    ports: {
      inputs: [
        {
          id: "cycleIndex",
          label: "Cycle Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "offset",
          label: "Offset",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "phasesPerCycle",
          label: "Phases Per Cycle",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "phaseIndex",
          label: "Phase Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "shiftedCycleDecimal",
          label: "Shifted Cycle Decimal",
          valueType: { type: "string" },
        },
        {
          id: "shiftedPhase",
          label: "Shifted Phase",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = phaseCycleIndexOffsetTool.execute;
export default phaseCycleIndexOffsetTool;
