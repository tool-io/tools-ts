import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly token: string };
export type Output = { readonly algorithm: string; readonly digest: string };
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
    algorithm: { type: "string", maxLength: 8192 },
    digest: { type: "string", maxLength: 8192 },
  },
  required: ["algorithm", "digest"],
} as const;
/** Compute csp hash source algorithm token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    const match =
      /^\x27(sha256|sha384|sha512)-([A-Za-z0-9+/]+={0,2})\x27(?![\s\S])/.exec(
        token,
      );
    domain(match);
    return { algorithm: match[1], digest: match[2] };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "'sha256-YWJj'" },
  output: { algorithm: "sha256", digest: "YWJj" },
} satisfies ToolExample<Input, Output>;
export const cspHashSourceAlgorithmTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "web/csp-hash-source-algorithm-token",
  title: "Csp Hash Source Algorithm Token Tool",
  description:
    "Compute csp hash source algorithm token from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
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
      { id: "algorithm", label: "Algorithm", valueType: { type: "string" } },
      { id: "digest", label: "Digest", valueType: { type: "string" } },
    ],
  },
});
export const run = cspHashSourceAlgorithmTokenTool.execute;
export default cspHashSourceAlgorithmTokenTool;
