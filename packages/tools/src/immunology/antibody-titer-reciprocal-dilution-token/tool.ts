import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = { readonly reciprocal: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reciprocal: { type: "integer" } },
  required: ["reciprocal"],
} as const;
/** Parse an exact positive 1:N dilution token without inferring an antibody endpoint or clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const match = /^1:([1-9]\d*)(?![\s\S])/.exec(token);
    H.domain(match, "token");
    const reciprocal = Number(match[1]);
    H.integer(reciprocal, 1);
    return { reciprocal };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "1:160" },
  output: { reciprocal: 160 },
} satisfies ToolExample<Input, Output>;
export const antibodyTiterReciprocalDilutionTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "immunology/antibody-titer-reciprocal-dilution-token",
      title: "Antibody Titer Reciprocal Dilution Token Tool",
      description:
        "Parse an exact positive 1:N dilution token without inferring an antibody endpoint or clinical interpretation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { reciprocal: { type: "integer" } },
        required: ["reciprocal"],
      },
      ports: {
        inputs: [
          {
            id: "token",
            label: "Token",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "reciprocal",
            label: "Reciprocal",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = antibodyTiterReciprocalDilutionTokenTool.execute;
export default antibodyTiterReciprocalDilutionTokenTool;
