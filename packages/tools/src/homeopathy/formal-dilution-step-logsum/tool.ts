import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly logDilutions: readonly number[];
  readonly repetitions: readonly number[];
};
export type Output = { readonly formalLogDilution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logDilutions: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    repetitions: {
      type: "array",
      maxItems: 256,
      items: { type: "integer", minimum: 0 },
    },
  },
  required: ["logDilutions", "repetitions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { formalLogDilution: { type: "number" } },
  required: ["formalLogDilution"],
} as const;
/** Sum supplied formal logarithmic dilution steps as notation arithmetic only; no activity or efficacy inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { logDilutions, repetitions } = request;
  const compute = (): Output => {
    H.domain(
      logDilutions.every((x) => x >= 0) && repetitions.every((x) => x >= 0),
    );
    return { formalLogDilution: H.dot(logDilutions, repetitions) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { logDilutions: [2, 3], repetitions: [4, 2] },
  output: { formalLogDilution: 14 },
} satisfies ToolExample<Input, Output>;
export const formalDilutionStepLogsumTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "homeopathy/formal-dilution-step-logsum",
    title: "Formal Dilution Step Logsum Tool",
    description:
      "Sum supplied formal logarithmic dilution steps as notation arithmetic only; no activity or efficacy inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        logDilutions: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        repetitions: {
          type: "array",
          maxItems: 256,
          items: { type: "integer", minimum: 0 },
        },
      },
      required: ["logDilutions", "repetitions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { formalLogDilution: { type: "number" } },
      required: ["formalLogDilution"],
    },
    ports: {
      inputs: [
        {
          id: "logDilutions",
          label: "Log Dilutions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "repetitions",
          label: "Repetitions",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "formalLogDilution",
          label: "Formal Log Dilution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = formalDilutionStepLogsumTool.execute;
export default formalDilutionStepLogsumTool;
