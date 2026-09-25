import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly offset: string };
export type Output = {
  readonly sign: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
  readonly totalSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offset: { type: "string", maxLength: 8192 } },
  required: ["offset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sign: { type: "integer" },
    hours: { type: "integer" },
    minutes: { type: "integer" },
    seconds: { type: "integer" },
    totalSeconds: { type: "integer" },
  },
  required: ["sign", "hours", "minutes", "seconds", "totalSeconds"],
} as const;
/** Compute timestamp offset second component token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { offset } = input;
  const compute = (): Output => {
    const m = /^([+-])(\d{2}):(\d{2}):(\d{2})(?![\s\S])/.exec(offset);
    domain(m);
    const hours = Number(m[2]),
      minutes = Number(m[3]),
      seconds = Number(m[4]),
      sign = m[1] === "-" ? -1 : 1;
    domain(hours <= 23 && minutes <= 59 && seconds <= 59);
    return {
      sign,
      hours,
      minutes,
      seconds,
      totalSeconds: sign * (hours * 3600 + minutes * 60 + seconds),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { offset: "+05:30:20" },
  output: { sign: 1, hours: 5, minutes: 30, seconds: 20, totalSeconds: 19820 },
} satisfies ToolExample<Input, Output>;
export const timestampOffsetSecondComponentTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "date/timestamp-offset-second-component-token",
  title: "Timestamp Offset Second Component Token Tool",
  description:
    "Compute timestamp offset second component token from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "offset",
        label: "Offset",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "sign", label: "Sign", valueType: { type: "integer" } },
      { id: "hours", label: "Hours", valueType: { type: "integer" } },
      { id: "minutes", label: "Minutes", valueType: { type: "integer" } },
      { id: "seconds", label: "Seconds", valueType: { type: "integer" } },
      {
        id: "totalSeconds",
        label: "Total Seconds",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = timestampOffsetSecondComponentTokenTool.execute;
export default timestampOffsetSecondComponentTokenTool;
