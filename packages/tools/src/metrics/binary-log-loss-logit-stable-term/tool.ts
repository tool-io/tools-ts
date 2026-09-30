import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly logit: number; readonly outcome: number };
export type Output = { readonly loss: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logit: { type: "number" },
    outcome: { type: "integer", minimum: 0, maximum: 1 },
  },
  required: ["logit", "outcome"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { loss: { type: "number" } },
  required: ["loss"],
} as const;
/** Compute binary log loss logit stable term from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { logit, outcome } = input;
  const compute = (): Output => {
    integer(outcome, 0, 1);
    return {
      loss:
        Math.max(logit, 0) -
        outcome * logit +
        Math.log1p(Math.exp(-Math.abs(logit))),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { logit: 0, outcome: 1 },
  output: { loss: 0.6931471805599453 },
} satisfies ToolExample<Input, Output>;
export const binaryLogLossLogitStableTermTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "metrics/binary-log-loss-logit-stable-term",
  title: "Binary Log Loss Logit Stable Term Tool",
  description:
    "Compute binary log loss logit stable term from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "logit",
        label: "Logit",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "outcome",
        label: "Outcome",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [{ id: "loss", label: "Loss", valueType: { type: "number" } }],
  },
});
export const run = binaryLogLossLogitStableTermTool.execute;
export default binaryLogLossLogitStableTermTool;
