import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredOutputDb: number;
  readonly measuredInputDb: number;
  readonly referenceGainDb: number;
};
export type Output = {
  readonly measuredGainDb: number;
  readonly gainGapDb: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredOutputDb: { type: "number" },
    measuredInputDb: { type: "number" },
    referenceGainDb: { type: "number" },
  },
  required: ["measuredOutputDb", "measuredInputDb", "referenceGainDb"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredGainDb: { type: "number" },
    gainGapDb: { type: "number" },
  },
  required: ["measuredGainDb", "gainGapDb"],
} as const;
/** Bench level-difference arithmetic with a supplied reference, not a device fitting recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredOutputDb, measuredInputDb, referenceGainDb } = request;
  const compute = (): Output => {
    return {
      measuredGainDb: measuredOutputDb - measuredInputDb,
      gainGapDb: measuredOutputDb - measuredInputDb - referenceGainDb,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredOutputDb: 80, measuredInputDb: 60, referenceGainDb: 15 },
  output: { measuredGainDb: 20, gainGapDb: 5 },
} satisfies ToolExample<Input, Output>;
export const hearingDeviceGainReferenceOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "audiology/hearing-device-gain-reference-offset",
    title: "Hearing Device Gain Reference Offset Tool",
    description:
      "Bench level-difference arithmetic with a supplied reference, not a device fitting recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredOutputDb: { type: "number" },
        measuredInputDb: { type: "number" },
        referenceGainDb: { type: "number" },
      },
      required: ["measuredOutputDb", "measuredInputDb", "referenceGainDb"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredGainDb: { type: "number" },
        gainGapDb: { type: "number" },
      },
      required: ["measuredGainDb", "gainGapDb"],
    },
    ports: {
      inputs: [
        {
          id: "measuredOutputDb",
          label: "Measured Output Db",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredInputDb",
          label: "Measured Input Db",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceGainDb",
          label: "Reference Gain Db",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "measuredGainDb",
          label: "Measured Gain Db",
          valueType: { type: "number" },
        },
        {
          id: "gainGapDb",
          label: "Gain Gap Db",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hearingDeviceGainReferenceOffsetTool.execute;
export default hearingDeviceGainReferenceOffsetTool;
