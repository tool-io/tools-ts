import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly elapsed: number;
  readonly opens: number;
  readonly closes: number;
};
export type Output = {
  readonly allowed: boolean;
  readonly early: boolean;
  readonly late: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "integer", minimum: 0 },
    opens: { type: "integer", minimum: 0 },
    closes: { type: "integer" },
  },
  required: ["elapsed", "opens", "closes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allowed: { type: "boolean" },
    early: { type: "boolean" },
    late: { type: "boolean" },
  },
  required: ["allowed", "early", "late"],
} as const;
/** Compute watchdog refresh window membership from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { elapsed, opens, closes } = input;
  const compute = (): Output => {
    integer(elapsed);
    integer(opens);
    integer(closes, opens);
    return {
      allowed: elapsed >= opens && elapsed <= closes,
      early: elapsed < opens,
      late: elapsed > closes,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { elapsed: 5, opens: 3, closes: 8 },
  output: { allowed: true, early: false, late: false },
} satisfies ToolExample<Input, Output>;
export const watchdogRefreshWindowMembershipTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "microcontroller/watchdog-refresh-window-membership",
  title: "Watchdog Refresh Window Membership Tool",
  description:
    "Compute watchdog refresh window membership from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "elapsed",
        label: "Elapsed",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "opens",
        label: "Opens",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "closes",
        label: "Closes",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "allowed", label: "Allowed", valueType: { type: "boolean" } },
      { id: "early", label: "Early", valueType: { type: "boolean" } },
      { id: "late", label: "Late", valueType: { type: "boolean" } },
    ],
  },
});
export const run = watchdogRefreshWindowMembershipTool.execute;
export default watchdogRefreshWindowMembershipTool;
