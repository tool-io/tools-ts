import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstBeat: number;
  readonly secondBeat: number;
  readonly beatsPerCycle: number;
  readonly positiveTie: boolean;
};
export type Output = {
  readonly signedBeatGap: number;
  readonly antipodal: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstBeat: { type: "integer" },
    secondBeat: { type: "integer" },
    beatsPerCycle: { type: "integer", minimum: 1 },
    positiveTie: { type: "boolean" },
  },
  required: ["firstBeat", "secondBeat", "beatsPerCycle", "positiveTie"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedBeatGap: { type: "integer" },
    antipodal: { type: "boolean" },
  },
  required: ["signedBeatGap", "antipodal"],
} as const;
/** Compare explicit beat indices on a caller-defined metrical cycle, retaining the half-cycle tie convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstBeat, secondBeat, beatsPerCycle, positiveTie } = request;
  const compute = (): Output => {
    H.integer(beatsPerCycle, 1);
    return (() => {
      const n = BigInt(beatsPerCycle),
        r = (((BigInt(secondBeat) - BigInt(firstBeat)) % n) + n) % n,
        tie = 2n * r === n,
        negative = 2n * r > n || (tie && !positiveTie);
      return { signedBeatGap: Number(negative ? r - n : r), antipodal: tie };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstBeat: 7, secondBeat: 1, beatsPerCycle: 8, positiveTie: true },
  output: { signedBeatGap: 2, antipodal: false },
} satisfies ToolExample<Input, Output>;
export const metricalCyclePhaseGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethnomusicology/metrical-cycle-phase-gap",
    title: "Metrical Cycle Phase Gap Tool",
    description:
      "Compare explicit beat indices on a caller-defined metrical cycle, retaining the half-cycle tie convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstBeat: { type: "integer" },
        secondBeat: { type: "integer" },
        beatsPerCycle: { type: "integer", minimum: 1 },
        positiveTie: { type: "boolean" },
      },
      required: ["firstBeat", "secondBeat", "beatsPerCycle", "positiveTie"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedBeatGap: { type: "integer" },
        antipodal: { type: "boolean" },
      },
      required: ["signedBeatGap", "antipodal"],
    },
    ports: {
      inputs: [
        {
          id: "firstBeat",
          label: "First Beat",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondBeat",
          label: "Second Beat",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "beatsPerCycle",
          label: "Beats Per Cycle",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "positiveTie",
          label: "Positive Tie",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "signedBeatGap",
          label: "Signed Beat Gap",
          valueType: { type: "integer" },
        },
        { id: "antipodal", label: "Antipodal", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = metricalCyclePhaseGapTool.execute;
export default metricalCyclePhaseGapTool;
