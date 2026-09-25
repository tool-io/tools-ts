import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly token: string };
export type Output = {
  readonly catalog: string;
  readonly defaultCatalog: boolean;
};
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
    catalog: { type: "string", maxLength: 8192 },
    defaultCatalog: { type: "boolean" },
  },
  required: ["catalog", "defaultCatalog"],
} as const;
/** Compute pnpm catalog reference token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    const m = /^catalog:([A-Za-z0-9_.-]*)(?![\s\S])/.exec(token);
    domain(m);
    return { catalog: m[1], defaultCatalog: m[1] === "" };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "catalog:react19" },
  output: { catalog: "react19", defaultCatalog: false },
} satisfies ToolExample<Input, Output>;
export const pnpmCatalogReferenceTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "development/pnpm-catalog-reference-token",
  title: "Pnpm Catalog Reference Token Tool",
  description:
    "Compute pnpm catalog reference token from explicit bounded inputs.",
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
      { id: "catalog", label: "Catalog", valueType: { type: "string" } },
      {
        id: "defaultCatalog",
        label: "Default Catalog",
        valueType: { type: "boolean" },
      },
    ],
  },
});
export const run = pnpmCatalogReferenceTokenTool.execute;
export default pnpmCatalogReferenceTokenTool;
