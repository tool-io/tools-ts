import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly error: number;
  readonly quantum: number;
  readonly ties: string;
};
export type Output = { readonly roundedError: number; readonly tie: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    error: { type: "number" },
    quantum: { type: "number", exclusiveMinimum: 0 },
    ties: { type: "string", maxLength: 8192, enum: ["even", "away"] },
  },
  required: ["error", "quantum", "ties"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { roundedError: { type: "number" }, tie: { type: "boolean" } },
  required: ["roundedError", "tie"],
} as const;
/** Round a signed forecast error to an explicit quantum with binary64 exact-half detection. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { error, quantum, ties } = request;
  const compute = (): Output => {
    H.positive(quantum);
    H.domain(["even", "away"].includes(ties));
    const z = Math.abs(error) / quantum,
      n = Math.floor(z),
      tie = z - n === 0.5,
      k =
        z - n > 0.5
          ? n + 1
          : z - n < 0.5
            ? n
            : ties === "away" || n % 2 === 1
              ? n + 1
              : n;
    return { roundedError: Math.sign(error) * k * quantum, tie };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { error: 2.5, quantum: 1, ties: "even" },
  output: { roundedError: 2, tie: true },
} satisfies ToolExample<Input, Output>;
export const forecastErrorQuantumTiePolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/forecast-error-quantum-tie-policy",
    title: "Forecast Error Quantum Tie Policy Tool",
    description:
      "Round a signed forecast error to an explicit quantum with binary64 exact-half detection.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        error: { type: "number" },
        quantum: { type: "number", exclusiveMinimum: 0 },
        ties: { type: "string", maxLength: 8192, enum: ["even", "away"] },
      },
      required: ["error", "quantum", "ties"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roundedError: { type: "number" },
        tie: { type: "boolean" },
      },
      required: ["roundedError", "tie"],
    },
    ports: {
      inputs: [
        {
          id: "error",
          label: "Error",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantum",
          label: "Quantum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ties",
          label: "Ties",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "roundedError",
          label: "Rounded Error",
          valueType: { type: "number" },
        },
        { id: "tie", label: "Tie", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = forecastErrorQuantumTiePolicyTool.execute;
export default forecastErrorQuantumTiePolicyTool;
