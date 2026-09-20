import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly x: number };
export type Output = {
  readonly linearAsymptote: number;
  readonly offset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { x: { type: "number", exclusiveMaximum: 0 } },
  required: ["x"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    linearAsymptote: { type: "number" },
    offset: { type: "number" },
  },
  required: ["linearAsymptote", "offset"],
} as const;
/** Evaluate the negative-tail asymptotic line x/2-1/2 of bent identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x } = request;
  const compute = (): Output => {
    H.domain(x < 0);
    return { linearAsymptote: x / 2 - 0.5, offset: -0.5 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x: -10 },
  output: { linearAsymptote: -5.5, offset: -0.5 },
} satisfies ToolExample<Input, Output>;
export const bentIdentityNegativeAsymptoteTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/bent-identity-negative-asymptote",
    title: "Bent Identity Negative Asymptote Tool",
    description:
      "Evaluate the negative-tail asymptotic line x/2-1/2 of bent identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { x: { type: "number", exclusiveMaximum: 0 } },
      required: ["x"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        linearAsymptote: { type: "number" },
        offset: { type: "number" },
      },
      required: ["linearAsymptote", "offset"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
      ],
      outputs: [
        {
          id: "linearAsymptote",
          label: "Linear Asymptote",
          valueType: { type: "number" },
        },
        { id: "offset", label: "Offset", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = bentIdentityNegativeAsymptoteTool.execute;
export default bentIdentityNegativeAsymptoteTool;
