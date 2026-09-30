import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
  positive,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly ticks: number;
  readonly nominalHz: number;
  readonly relativeTolerance: number;
};
export type Output = {
  readonly minimumSeconds: number;
  readonly maximumSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ticks: { type: "integer", minimum: 1 },
    nominalHz: { type: "number", exclusiveMinimum: 0 },
    relativeTolerance: { type: "number" },
  },
  required: ["ticks", "nominalHz", "relativeTolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumSeconds: { type: "number" },
    maximumSeconds: { type: "number" },
  },
  required: ["minimumSeconds", "maximumSeconds"],
} as const;
/** Compute watchdog clock tolerance interval from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { ticks, nominalHz, relativeTolerance } = input;
  const compute = (): Output => {
    integer(ticks, 1);
    positive(nominalHz);
    domain(relativeTolerance >= 0 && relativeTolerance < 1);
    return {
      minimumSeconds: ticks / (nominalHz * (1 + relativeTolerance)),
      maximumSeconds: ticks / (nominalHz * (1 - relativeTolerance)),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { ticks: 100, nominalHz: 100, relativeTolerance: 0 },
  output: { minimumSeconds: 1, maximumSeconds: 1 },
} satisfies ToolExample<Input, Output>;
export const watchdogClockToleranceIntervalTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "microcontroller/watchdog-clock-tolerance-interval",
  title: "Watchdog Clock Tolerance Interval Tool",
  description:
    "Compute watchdog clock tolerance interval from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "ticks",
        label: "Ticks",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "nominalHz",
        label: "Nominal Hz",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "relativeTolerance",
        label: "Relative Tolerance",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "minimumSeconds",
        label: "Minimum Seconds",
        valueType: { type: "number" },
      },
      {
        id: "maximumSeconds",
        label: "Maximum Seconds",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = watchdogClockToleranceIntervalTool.execute;
export default watchdogClockToleranceIntervalTool;
