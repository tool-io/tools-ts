import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly includedDuration: number;
  readonly recordedDuration: number;
};
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    includedDuration: { type: "number", minimum: 0 },
    recordedDuration: { type: "number", minimum: 0 },
  },
  required: ["includedDuration", "recordedDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Calculate air sample duration share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { includedDuration, recordedDuration } = request;
  const compute = (): Output => {
    H.domain(
      recordedDuration >= 0 &&
        includedDuration >= 0 &&
        includedDuration <= recordedDuration,
    );
    return {
      share: recordedDuration > 0 ? includedDuration / recordedDuration : 0,
      defined: recordedDuration > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { includedDuration: 3, recordedDuration: 12 },
  output: { share: 0.25, defined: true },
} satisfies ToolExample<Input, Output>;
export const airSampleDurationShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-health/air-sample-duration-share",
    title: "Air Sample Duration Share Tool",
    description:
      "Calculate air sample duration share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        includedDuration: { type: "number", minimum: 0 },
        recordedDuration: { type: "number", minimum: 0 },
      },
      required: ["includedDuration", "recordedDuration"],
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
          id: "includedDuration",
          label: "Included Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedDuration",
          label: "Recorded Duration",
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
export const run = airSampleDurationShareTool.execute;
export default airSampleDurationShareTool;
