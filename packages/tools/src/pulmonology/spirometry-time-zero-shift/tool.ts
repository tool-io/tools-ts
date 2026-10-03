import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedTime: number;
  readonly suppliedZero: number;
};
export type Output = { readonly shiftedTime: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedTime: { type: "number" },
    suppliedZero: { type: "number" },
  },
  required: ["recordedTime", "suppliedZero"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { shiftedTime: { type: "number" } },
  required: ["shiftedTime"],
} as const;
/** Shift a supplied research recording clock without assessing test quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedTime, suppliedZero } = request;
  const compute = (): Output => {
    return { shiftedTime: recordedTime - suppliedZero };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedTime: 12, suppliedZero: 10 },
  output: { shiftedTime: 2 },
} satisfies ToolExample<Input, Output>;
export const spirometryTimeZeroShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pulmonology/spirometry-time-zero-shift",
    title: "Spirometry Time Zero Shift Tool",
    description:
      "Shift a supplied research recording clock without assessing test quality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedTime: { type: "number" },
        suppliedZero: { type: "number" },
      },
      required: ["recordedTime", "suppliedZero"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { shiftedTime: { type: "number" } },
      required: ["shiftedTime"],
    },
    ports: {
      inputs: [
        {
          id: "recordedTime",
          label: "Recorded Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedZero",
          label: "Supplied Zero",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "shiftedTime",
          label: "Shifted Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = spirometryTimeZeroShiftTool.execute;
export default spirometryTimeZeroShiftTool;
