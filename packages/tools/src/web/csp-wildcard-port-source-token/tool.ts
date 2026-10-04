import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly source: string };
export type Output = { readonly host: string; readonly wildcardPort: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { source: { type: "string", maxLength: 8192 } },
  required: ["source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    host: { type: "string", maxLength: 8192 },
    wildcardPort: { type: "boolean" },
  },
  required: ["host", "wildcardPort"],
} as const;
/** Compute csp wildcard port source token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { source } = input;
  const compute = (): Output => {
    const m = /^([A-Za-z0-9*.-]+):([*]|\d{1,5})(?![\s\S])/.exec(source);
    domain(m);
    if (m[2] !== "*") integer(Number(m[2]), 1, 65535);
    return { host: m[1], wildcardPort: m[2] === "*" };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { source: "example.com:*" },
  output: { host: "example.com", wildcardPort: true },
} satisfies ToolExample<Input, Output>;
export const cspWildcardPortSourceTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "web/csp-wildcard-port-source-token",
  title: "Csp Wildcard Port Source Token Tool",
  description:
    "Compute csp wildcard port source token from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "source",
        label: "Source",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "host", label: "Host", valueType: { type: "string" } },
      {
        id: "wildcardPort",
        label: "Wildcard Port",
        valueType: { type: "boolean" },
      },
    ],
  },
});
export const run = cspWildcardPortSourceTokenTool.execute;
export default cspWildcardPortSourceTokenTool;
