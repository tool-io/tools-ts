import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly phaseDifference: number;
  readonly tiePositive: boolean;
};
export type Output = {
  readonly principalDifference: number;
  readonly tied: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phaseDifference: { type: "number" },
    tiePositive: { type: "boolean" },
  },
  required: ["phaseDifference", "tiePositive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    principalDifference: { type: "number" },
    tied: { type: "boolean" },
  },
  required: ["principalDifference", "tied"],
} as const;
/** Principal phase difference with an explicit exact-pi tie direction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { phaseDifference, tiePositive } = request;
  const compute = (): Output => {
    const tau = 2 * Math.PI;
    let r = phaseDifference % tau;
    if (r < 0) r += tau;
    const tied = r === Math.PI;
    return {
      principalDifference: tied
        ? tiePositive
          ? Math.PI
          : -Math.PI
        : r > Math.PI
          ? r - tau
          : r,
      tied,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { phaseDifference: 3.141592653589793, tiePositive: false },
  output: { principalDifference: -3.141592653589793, tied: true },
} satisfies ToolExample<Input, Output>;
export const wavePacketPhaseUnwrappingTieTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-physics/wave-packet-phase-unwrapping-tie",
    title: "Wave Packet Phase Unwrapping Tie Tool",
    description:
      "Principal phase difference with an explicit exact-pi tie direction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phaseDifference: { type: "number" },
        tiePositive: { type: "boolean" },
      },
      required: ["phaseDifference", "tiePositive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        principalDifference: { type: "number" },
        tied: { type: "boolean" },
      },
      required: ["principalDifference", "tied"],
    },
    ports: {
      inputs: [
        {
          id: "phaseDifference",
          label: "Phase Difference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tiePositive",
          label: "Tie Positive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "principalDifference",
          label: "Principal Difference",
          valueType: { type: "number" },
        },
        { id: "tied", label: "Tied", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = wavePacketPhaseUnwrappingTieTool.execute;
export default wavePacketPhaseUnwrappingTieTool;
