import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly authority: string };
export type Output = {
  readonly host: string;
  readonly port: string;
  readonly explicitEmpty: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { authority: { type: "string", maxLength: 8192 } },
  required: ["authority"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    host: { type: "string", maxLength: 8192 },
    port: { type: "string", maxLength: 8192 },
    explicitEmpty: { type: "boolean" },
  },
  required: ["host", "port", "explicitEmpty"],
} as const;
/** Compute uri authority empty port marker from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { authority } = input;
  const compute = (): Output => {
    const m = /^(\[[^\]]+\]|[^:\s]+)(?::(\d*))?(?![\s\S])/.exec(authority);
    domain(m);
    return { host: m[1], port: m[2] ?? "", explicitEmpty: m[2] === "" };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { authority: "example.com:" },
  output: { host: "example.com", port: "", explicitEmpty: true },
} satisfies ToolExample<Input, Output>;
export const uriAuthorityEmptyPortMarkerTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "parse/uri-authority-empty-port-marker",
  title: "URI Authority Empty Port Marker Tool",
  description:
    "Compute uri authority empty port marker from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "authority",
        label: "Authority",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "host", label: "Host", valueType: { type: "string" } },
      { id: "port", label: "Port", valueType: { type: "string" } },
      {
        id: "explicitEmpty",
        label: "Explicit Empty",
        valueType: { type: "boolean" },
      },
    ],
  },
});
export const run = uriAuthorityEmptyPortMarkerTool.execute;
export default uriAuthorityEmptyPortMarkerTool;
