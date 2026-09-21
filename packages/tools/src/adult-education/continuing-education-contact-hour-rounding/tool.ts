import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly minutes: number;
  readonly minutesPerCredit: number;
  readonly rounding: string;
};
export type Output = { readonly rawCredit: number; readonly credit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minutes: { type: "number", minimum: 0 },
    minutesPerCredit: { type: "number", exclusiveMinimum: 0 },
    rounding: {
      type: "string",
      maxLength: 8192,
      enum: ["floor", "ceil", "nearest"],
    },
  },
  required: ["minutes", "minutesPerCredit", "rounding"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rawCredit: { type: "number" }, credit: { type: "number" } },
  required: ["rawCredit", "credit"],
} as const;
/** Explicit credit duration and whole-credit rounding, with nearest ties upward. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { minutes, minutesPerCredit, rounding } = request;
  const compute = (): Output => {
    H.domain(minutes >= 0);
    H.positive(minutesPerCredit);
    H.domain(["floor", "ceil", "nearest"].includes(rounding));
    return {
      rawCredit: minutes / minutesPerCredit,
      credit:
        rounding === "floor"
          ? Math.floor(minutes / minutesPerCredit)
          : rounding === "ceil"
            ? Math.ceil(minutes / minutesPerCredit)
            : Math.round(minutes / minutesPerCredit),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { minutes: 125, minutesPerCredit: 60, rounding: "floor" },
  output: { rawCredit: 2.0833333333333335, credit: 2 },
} satisfies ToolExample<Input, Output>;
export const continuingEducationContactHourRoundingTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "adult-education/continuing-education-contact-hour-rounding",
      title: "Continuing Education Contact Hour Rounding Tool",
      description:
        "Explicit credit duration and whole-credit rounding, with nearest ties upward.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          minutes: { type: "number", minimum: 0 },
          minutesPerCredit: { type: "number", exclusiveMinimum: 0 },
          rounding: {
            type: "string",
            maxLength: 8192,
            enum: ["floor", "ceil", "nearest"],
          },
        },
        required: ["minutes", "minutesPerCredit", "rounding"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rawCredit: { type: "number" },
          credit: { type: "number" },
        },
        required: ["rawCredit", "credit"],
      },
      ports: {
        inputs: [
          {
            id: "minutes",
            label: "Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "minutesPerCredit",
            label: "Minutes Per Credit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rounding",
            label: "Rounding",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "rawCredit",
            label: "Raw Credit",
            valueType: { type: "number" },
          },
          { id: "credit", label: "Credit", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = continuingEducationContactHourRoundingTool.execute;
export default continuingEducationContactHourRoundingTool;
