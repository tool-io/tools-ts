import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly receivedAt: number;
  readonly releasedAt: number;
  readonly receivedClockOffset: number;
  readonly releasedClockOffset: number;
};
export type Output = { readonly correctedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    receivedAt: { type: "number" },
    releasedAt: { type: "number" },
    receivedClockOffset: { type: "number" },
    releasedClockOffset: { type: "number" },
  },
  required: [
    "receivedAt",
    "releasedAt",
    "receivedClockOffset",
    "releasedClockOffset",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correctedGap: { type: "number" } },
  required: ["correctedGap"],
} as const;
/** Compare deidentified custody event clocks under explicit offsets without asserting chain-of-custody validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { receivedAt, releasedAt, receivedClockOffset, releasedClockOffset } =
    request;
  const compute = (): Output => {
    return {
      correctedGap:
        receivedAt - receivedClockOffset - releasedAt + releasedClockOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    receivedAt: 20,
    releasedAt: 10,
    receivedClockOffset: 3,
    releasedClockOffset: 1,
  },
  output: { correctedGap: 8 },
} satisfies ToolExample<Input, Output>;
export const custodyClockOffsetGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/custody-clock-offset-gap",
    title: "Custody Clock Offset Gap Tool",
    description:
      "Compare deidentified custody event clocks under explicit offsets without asserting chain-of-custody validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        receivedAt: { type: "number" },
        releasedAt: { type: "number" },
        receivedClockOffset: { type: "number" },
        releasedClockOffset: { type: "number" },
      },
      required: [
        "receivedAt",
        "releasedAt",
        "receivedClockOffset",
        "releasedClockOffset",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { correctedGap: { type: "number" } },
      required: ["correctedGap"],
    },
    ports: {
      inputs: [
        {
          id: "receivedAt",
          label: "Received At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "releasedAt",
          label: "Released At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "receivedClockOffset",
          label: "Received Clock Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "releasedClockOffset",
          label: "Released Clock Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedGap",
          label: "Corrected Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = custodyClockOffsetGapTool.execute;
export default custodyClockOffsetGapTool;
