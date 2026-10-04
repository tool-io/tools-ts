import { parseUrl } from "../../core/url.js";
import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly origin: string };
export type Output = {
  readonly opaque: boolean;
  readonly serializedOrigin: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { origin: { type: "string", maxLength: 8192 } },
  required: ["origin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opaque: { type: "boolean" },
    serializedOrigin: { type: "string", maxLength: 8192 },
  },
  required: ["opaque", "serializedOrigin"],
} as const;
/** Compute cors origin null literal distinction from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { origin } = input;
  const compute = (): Output => {
    if (origin === "null") return { opaque: true, serializedOrigin: "null" };
    let u;
    try {
      u = parseUrl(origin);
    } catch {
      domain(
        false,
        "origin",
        "Enter a canonical HTTP origin or the literal null.",
      );
    }
    domain(["http:", "https:"].includes(u.protocol) && u.origin === origin);
    return { opaque: false, serializedOrigin: u.origin };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { origin: "null" },
  output: { opaque: true, serializedOrigin: "null" },
} satisfies ToolExample<Input, Output>;
export const corsOriginNullLiteralDistinctionTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "web/cors-origin-null-literal-distinction",
  title: "CORS Origin Null Literal Distinction Tool",
  description:
    "Compute cors origin null literal distinction from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "origin",
        label: "Origin",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "opaque", label: "Opaque", valueType: { type: "boolean" } },
      {
        id: "serializedOrigin",
        label: "Serialized Origin",
        valueType: { type: "string" },
      },
    ],
  },
});
export const run = corsOriginNullLiteralDistinctionTool.execute;
export default corsOriginNullLiteralDistinctionTool;
