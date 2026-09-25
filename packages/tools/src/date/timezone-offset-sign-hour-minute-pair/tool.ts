import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly sign: string;
  readonly hours: number;
  readonly minutes: number;
};
export type Output = { readonly offset: string; readonly minutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sign: { type: "string", maxLength: 8192 },
    hours: { type: "integer", minimum: 0, maximum: 23 },
    minutes: { type: "integer", minimum: 0, maximum: 59 },
  },
  required: ["sign", "hours", "minutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offset: { type: "string", maxLength: 8192 },
    minutes: { type: "integer" },
  },
  required: ["offset", "minutes"],
} as const;
/** Compute timezone offset sign hour minute pair from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { sign, hours, minutes } = input;
  const compute = (): Output => {
    domain(sign === "+" || sign === "-");
    integer(hours, 0, 23);
    integer(minutes, 0, 59);
    return {
      offset:
        sign +
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0"),
      minutes: (sign === "-" ? -1 : 1) * (hours * 60 + minutes),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { sign: "-", hours: 5, minutes: 30 },
  output: { offset: "-05:30", minutes: -330 },
} satisfies ToolExample<Input, Output>;
export const timezoneOffsetSignHourMinutePairTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "date/timezone-offset-sign-hour-minute-pair",
  title: "Timezone Offset Sign Hour Minute Pair Tool",
  description:
    "Compute timezone offset sign hour minute pair from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "sign",
        label: "Sign",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "hours",
        label: "Hours",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "minutes",
        label: "Minutes",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "offset", label: "Offset", valueType: { type: "string" } },
      { id: "minutes", label: "Minutes", valueType: { type: "integer" } },
    ],
  },
});
export const run = timezoneOffsetSignHourMinutePairTool.execute;
export default timezoneOffsetSignHourMinutePairTool;
