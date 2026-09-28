import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedStart: number;
  readonly recordedEnd: number;
  readonly startClockOffset: number;
  readonly endClockOffset: number;
  readonly creditedPause: number;
};
export type Output = {
  readonly correctedElapsed: number;
  readonly countedElapsed: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedStart: { type: "number" },
    recordedEnd: { type: "number" },
    startClockOffset: { type: "number" },
    endClockOffset: { type: "number" },
    creditedPause: { type: "number", minimum: 0 },
  },
  required: [
    "recordedStart",
    "recordedEnd",
    "startClockOffset",
    "endClockOffset",
    "creditedPause",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedElapsed: { type: "number" },
    countedElapsed: { type: "number" },
  },
  required: ["correctedElapsed", "countedElapsed"],
} as const;
/** Normalize supplied clock offsets and pause credit without interpreting room qualification requirements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    recordedStart,
    recordedEnd,
    startClockOffset,
    endClockOffset,
    creditedPause,
  } = request;
  const compute = (): Output => {
    H.domain(
      creditedPause >= 0 &&
        recordedEnd - endClockOffset - recordedStart + startClockOffset >=
          creditedPause,
    );
    return {
      correctedElapsed:
        recordedEnd - endClockOffset - recordedStart + startClockOffset,
      countedElapsed:
        recordedEnd -
        endClockOffset -
        recordedStart +
        startClockOffset -
        creditedPause,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedStart: 10,
    recordedEnd: 50,
    startClockOffset: 2,
    endClockOffset: 4,
    creditedPause: 5,
  },
  output: { correctedElapsed: 38, countedElapsed: 33 },
} satisfies ToolExample<Input, Output>;
export const gmpRoomClockOffsetCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gmp/gmp-room-clock-offset-credit",
    title: "GMP Room Clock Offset Credit Tool",
    description:
      "Normalize supplied clock offsets and pause credit without interpreting room qualification requirements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedStart: { type: "number" },
        recordedEnd: { type: "number" },
        startClockOffset: { type: "number" },
        endClockOffset: { type: "number" },
        creditedPause: { type: "number", minimum: 0 },
      },
      required: [
        "recordedStart",
        "recordedEnd",
        "startClockOffset",
        "endClockOffset",
        "creditedPause",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedElapsed: { type: "number" },
        countedElapsed: { type: "number" },
      },
      required: ["correctedElapsed", "countedElapsed"],
    },
    ports: {
      inputs: [
        {
          id: "recordedStart",
          label: "Recorded Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedEnd",
          label: "Recorded End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "startClockOffset",
          label: "Start Clock Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endClockOffset",
          label: "End Clock Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "creditedPause",
          label: "Credited Pause",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedElapsed",
          label: "Corrected Elapsed",
          valueType: { type: "number" },
        },
        {
          id: "countedElapsed",
          label: "Counted Elapsed",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gmpRoomClockOffsetCreditTool.execute;
export default gmpRoomClockOffsetCreditTool;
