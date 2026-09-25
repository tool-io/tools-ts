import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly validLookDuration: number;
  readonly recordedLookDuration: number;
};
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    validLookDuration: { type: "number", minimum: 0 },
    recordedLookDuration: { type: "number", minimum: 0 },
  },
  required: ["validLookDuration", "recordedLookDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Audit caller-classified research looking-time validity without developmental interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { validLookDuration, recordedLookDuration } = request;
  const compute = (): Output => {
    H.domain(
      recordedLookDuration >= 0 &&
        validLookDuration >= 0 &&
        validLookDuration <= recordedLookDuration,
    );
    return {
      share:
        recordedLookDuration > 0 ? validLookDuration / recordedLookDuration : 0,
      defined: recordedLookDuration > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { validLookDuration: 3, recordedLookDuration: 4 },
  output: { share: 0.75, defined: true },
} satisfies ToolExample<Input, Output>;
export const childTaskLookValidityShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/child-task-look-validity-share",
    title: "Child Task Look Validity Share Tool",
    description:
      "Audit caller-classified research looking-time validity without developmental interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        validLookDuration: { type: "number", minimum: 0 },
        recordedLookDuration: { type: "number", minimum: 0 },
      },
      required: ["validLookDuration", "recordedLookDuration"],
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
          id: "validLookDuration",
          label: "Valid Look Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedLookDuration",
          label: "Recorded Look Duration",
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
export const run = childTaskLookValidityShareTool.execute;
export default childTaskLookValidityShareTool;
