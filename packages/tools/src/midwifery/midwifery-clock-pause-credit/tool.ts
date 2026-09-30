import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsed: number;
  readonly paused: number;
  readonly overlapWithOtherCredit: number;
  readonly creditPauses: boolean;
};
export type Output = {
  readonly netElapsed: number;
  readonly pauseCredit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number", minimum: 0 },
    paused: { type: "number", minimum: 0 },
    overlapWithOtherCredit: { type: "number", minimum: 0 },
    creditPauses: { type: "boolean" },
  },
  required: ["elapsed", "paused", "overlapWithOtherCredit", "creditPauses"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netElapsed: { type: "number" },
    pauseCredit: { type: "number" },
  },
  required: ["netElapsed", "pauseCredit"],
} as const;
/** Clock accounting for supplied administrative pause intervals without clinical timing rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsed, paused, overlapWithOtherCredit, creditPauses } = request;
  const compute = (): Output => {
    H.domain(
      elapsed >= 0 &&
        paused >= 0 &&
        paused <= elapsed &&
        overlapWithOtherCredit >= 0 &&
        overlapWithOtherCredit <= paused,
    );
    return {
      netElapsed:
        elapsed - (creditPauses ? paused - overlapWithOtherCredit : 0),
      pauseCredit: creditPauses ? paused - overlapWithOtherCredit : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    elapsed: 100,
    paused: 20,
    overlapWithOtherCredit: 5,
    creditPauses: true,
  },
  output: { netElapsed: 85, pauseCredit: 15 },
} satisfies ToolExample<Input, Output>;
export const midwiferyClockPauseCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "midwifery/midwifery-clock-pause-credit",
    title: "Midwifery Clock Pause Credit Tool",
    description:
      "Clock accounting for supplied administrative pause intervals without clinical timing rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number", minimum: 0 },
        paused: { type: "number", minimum: 0 },
        overlapWithOtherCredit: { type: "number", minimum: 0 },
        creditPauses: { type: "boolean" },
      },
      required: ["elapsed", "paused", "overlapWithOtherCredit", "creditPauses"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netElapsed: { type: "number" },
        pauseCredit: { type: "number" },
      },
      required: ["netElapsed", "pauseCredit"],
    },
    ports: {
      inputs: [
        {
          id: "elapsed",
          label: "Elapsed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "paused",
          label: "Paused",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlapWithOtherCredit",
          label: "Overlap With Other Credit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "creditPauses",
          label: "Credit Pauses",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "netElapsed",
          label: "Net Elapsed",
          valueType: { type: "number" },
        },
        {
          id: "pauseCredit",
          label: "Pause Credit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = midwiferyClockPauseCreditTool.execute;
export default midwiferyClockPauseCreditTool;
