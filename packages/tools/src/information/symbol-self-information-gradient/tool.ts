import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly probability: number; readonly logBase: number };
export type Output = { readonly gradient: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probability: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    logBase: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["probability", "logBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gradient: { type: "number" } },
  required: ["gradient"],
} as const;
/** Calculate symbol self information gradient from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { probability, logBase } = request;
  const compute = (): Output => {
    H.domain(
      probability > 0 && probability <= 1 && logBase > 0 && logBase !== 1,
    );
    return { gradient: -1 / (probability * Math.log(logBase)) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { probability: 0.5, logBase: 2.718281828459045 },
  output: { gradient: -2 },
} satisfies ToolExample<Input, Output>;
export const symbolSelfInformationGradientTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information/symbol-self-information-gradient",
    title: "Symbol Self Information Gradient Tool",
    description:
      "Calculate symbol self information gradient from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probability: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        logBase: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["probability", "logBase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gradient: { type: "number" } },
      required: ["gradient"],
    },
    ports: {
      inputs: [
        {
          id: "probability",
          label: "Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "logBase",
          label: "Log Base",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gradient", label: "Gradient", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = symbolSelfInformationGradientTool.execute;
export default symbolSelfInformationGradientTool;
