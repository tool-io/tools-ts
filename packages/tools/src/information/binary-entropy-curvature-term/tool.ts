import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly probability: number; readonly logBase: number };
export type Output = { readonly curvature: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probability: { type: "number", exclusiveMinimum: 0, exclusiveMaximum: 1 },
    logBase: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["probability", "logBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { curvature: { type: "number" } },
  required: ["curvature"],
} as const;
/** Return Bernoulli entropy’s second derivative under an explicit logarithm base, without computing entropy itself. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { probability, logBase } = request;
  const compute = (): Output => {
    H.domain(
      probability > 0 && probability < 1 && logBase > 0 && logBase !== 1,
    );
    return {
      curvature: -1 / (probability * (1 - probability) * Math.log(logBase)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { probability: 0.5, logBase: 2.718281828459045 },
  output: { curvature: -4 },
} satisfies ToolExample<Input, Output>;
export const binaryEntropyCurvatureTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information/binary-entropy-curvature-term",
    title: "Binary Entropy Curvature Term Tool",
    description:
      "Return Bernoulli entropy’s second derivative under an explicit logarithm base, without computing entropy itself.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probability: {
          type: "number",
          exclusiveMinimum: 0,
          exclusiveMaximum: 1,
        },
        logBase: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["probability", "logBase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { curvature: { type: "number" } },
      required: ["curvature"],
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
        { id: "curvature", label: "Curvature", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = binaryEntropyCurvatureTermTool.execute;
export default binaryEntropyCurvatureTermTool;
