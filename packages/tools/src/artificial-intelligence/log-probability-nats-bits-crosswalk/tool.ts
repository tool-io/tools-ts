import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly logProbabilityNats: number };
export type Output = {
  readonly logProbabilityBits: number;
  readonly surprisalBits: number;
  readonly probability: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { logProbabilityNats: { type: "number", maximum: 0 } },
  required: ["logProbabilityNats"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logProbabilityBits: { type: "number" },
    surprisalBits: { type: "number" },
    probability: { type: "number" },
  },
  required: ["logProbabilityBits", "surprisalBits", "probability"],
} as const;
/** Calculate log probability nats bits crosswalk from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { logProbabilityNats } = request;
  const compute = (): Output => {
    H.domain(logProbabilityNats <= 0);
    return {
      logProbabilityBits: logProbabilityNats / Math.LN2,
      surprisalBits: -logProbabilityNats / Math.LN2,
      probability: Math.exp(logProbabilityNats),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { logProbabilityNats: -0.6931471805599453 },
  output: { logProbabilityBits: -1, surprisalBits: 1, probability: 0.5 },
} satisfies ToolExample<Input, Output>;
export const logProbabilityNatsBitsCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "artificial-intelligence/log-probability-nats-bits-crosswalk",
    title: "Log Probability Nats Bits Crosswalk Tool",
    description:
      "Calculate log probability nats bits crosswalk from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { logProbabilityNats: { type: "number", maximum: 0 } },
      required: ["logProbabilityNats"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        logProbabilityBits: { type: "number" },
        surprisalBits: { type: "number" },
        probability: { type: "number" },
      },
      required: ["logProbabilityBits", "surprisalBits", "probability"],
    },
    ports: {
      inputs: [
        {
          id: "logProbabilityNats",
          label: "Log Probability Nats",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "logProbabilityBits",
          label: "Log Probability Bits",
          valueType: { type: "number" },
        },
        {
          id: "surprisalBits",
          label: "Surprisal Bits",
          valueType: { type: "number" },
        },
        {
          id: "probability",
          label: "Probability",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = logProbabilityNatsBitsCrosswalkTool.execute;
export default logProbabilityNatsBitsCrosswalkTool;
