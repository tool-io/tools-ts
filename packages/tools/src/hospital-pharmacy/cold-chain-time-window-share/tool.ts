import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedDuration: number;
  readonly withinSuppliedBandDuration: number;
};
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedDuration: { type: "number", minimum: 0 },
    withinSuppliedBandDuration: { type: "number", minimum: 0 },
  },
  required: ["recordedDuration", "withinSuppliedBandDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Audit caller-classified storage-record duration without choosing temperature limits or certifying stability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedDuration, withinSuppliedBandDuration } = request;
  const compute = (): Output => {
    H.domain(
      recordedDuration >= 0 &&
        withinSuppliedBandDuration >= 0 &&
        withinSuppliedBandDuration <= recordedDuration,
    );
    return {
      share:
        recordedDuration > 0
          ? withinSuppliedBandDuration / recordedDuration
          : 0,
      defined: recordedDuration > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedDuration: 20, withinSuppliedBandDuration: 15 },
  output: { share: 0.75, defined: true },
} satisfies ToolExample<Input, Output>;
export const coldChainTimeWindowShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospital-pharmacy/cold-chain-time-window-share",
    title: "Cold Chain Time Window Share Tool",
    description:
      "Audit caller-classified storage-record duration without choosing temperature limits or certifying stability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedDuration: { type: "number", minimum: 0 },
        withinSuppliedBandDuration: { type: "number", minimum: 0 },
      },
      required: ["recordedDuration", "withinSuppliedBandDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" }, defined: { type: "boolean" } },
      required: ["share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "recordedDuration",
          label: "Recorded Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "withinSuppliedBandDuration",
          label: "Within Supplied Band Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = coldChainTimeWindowShareTool.execute;
export default coldChainTimeWindowShareTool;
