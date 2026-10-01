import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly advertisedLifetime: number;
  readonly elapsedSeconds: number;
};
export type Output = {
  readonly remainingSeconds: number;
  readonly withdraw: boolean;
  readonly expired: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    advertisedLifetime: { type: "integer", minimum: 0, maximum: 65535 },
    elapsedSeconds: { type: "integer", minimum: 0 },
  },
  required: ["advertisedLifetime", "elapsedSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingSeconds: { type: "integer" },
    withdraw: { type: "boolean" },
    expired: { type: "boolean" },
  },
  required: ["remainingSeconds", "withdraw", "expired"],
} as const;
/** Compute icmpv6 router lifetime remainder from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { advertisedLifetime, elapsedSeconds } = input;
  const compute = (): Output => {
    integer(advertisedLifetime, 0, 65535);
    integer(elapsedSeconds);
    return {
      remainingSeconds: Math.max(0, advertisedLifetime - elapsedSeconds),
      withdraw: advertisedLifetime === 0,
      expired: elapsedSeconds >= advertisedLifetime,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { advertisedLifetime: 1800, elapsedSeconds: 600 },
  output: { remainingSeconds: 1200, withdraw: false, expired: false },
} satisfies ToolExample<Input, Output>;
export const icmpv6RouterLifetimeRemainderTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "network/icmpv6-router-lifetime-remainder",
  title: "Icmpv6 Router Lifetime Remainder Tool",
  description:
    "Compute icmpv6 router lifetime remainder from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "advertisedLifetime",
        label: "Advertised Lifetime",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "elapsedSeconds",
        label: "Elapsed Seconds",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "remainingSeconds",
        label: "Remaining Seconds",
        valueType: { type: "integer" },
      },
      { id: "withdraw", label: "Withdraw", valueType: { type: "boolean" } },
      { id: "expired", label: "Expired", valueType: { type: "boolean" } },
    ],
  },
});
export const run = icmpv6RouterLifetimeRemainderTool.execute;
export default icmpv6RouterLifetimeRemainderTool;
