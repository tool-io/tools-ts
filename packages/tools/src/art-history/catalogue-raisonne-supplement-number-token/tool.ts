import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = { readonly number: number; readonly suffix: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    number: { type: "integer" },
    suffix: { type: "string", maxLength: 8192 },
  },
  required: ["number", "suffix"],
} as const;
/** Parse a positive decimal catalogue number with an optional lowercase ASCII supplement suffix; not an attribution check. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const match = /^([1-9][0-9]*)([a-z]?)(?![\s\S])/.exec(token);
    H.domain(match !== null);
    const number = Number(match[1]);
    H.integer(number, 1);
    return { number, suffix: match[2] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "123a" },
  output: { number: 123, suffix: "a" },
} satisfies ToolExample<Input, Output>;
export const catalogueRaisonneSupplementNumberTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "art-history/catalogue-raisonne-supplement-number-token",
      title: "Catalogue Raisonne Supplement Number Token Tool",
      description:
        "Parse a positive decimal catalogue number with an optional lowercase ASCII supplement suffix; not an attribution check.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          number: { type: "integer" },
          suffix: { type: "string", maxLength: 8192 },
        },
        required: ["number", "suffix"],
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
          { id: "number", label: "Number", valueType: { type: "integer" } },
          { id: "suffix", label: "Suffix", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = catalogueRaisonneSupplementNumberTokenTool.execute;
export default catalogueRaisonneSupplementNumberTokenTool;
