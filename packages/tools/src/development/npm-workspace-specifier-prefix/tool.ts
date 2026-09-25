import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly specifier: string };
export type Output = { readonly selector: string; readonly shorthand: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { specifier: { type: "string", maxLength: 8192 } },
  required: ["specifier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selector: { type: "string", maxLength: 8192 },
    shorthand: { type: "boolean" },
  },
  required: ["selector", "shorthand"],
} as const;
/** Compute npm workspace specifier prefix from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { specifier } = input;
  const compute = (): Output => {
    domain(specifier.startsWith("workspace:") && specifier.length > 10);
    const selector = specifier.slice(10);
    return { selector, shorthand: ["*", "~", "^"].includes(selector) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { specifier: "workspace:^" },
  output: { selector: "^", shorthand: true },
} satisfies ToolExample<Input, Output>;
export const npmWorkspaceSpecifierPrefixTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "development/npm-workspace-specifier-prefix",
  title: "npm Workspace Specifier Prefix Tool",
  description:
    "Compute npm workspace specifier prefix from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "specifier",
        label: "Specifier",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "selector", label: "Selector", valueType: { type: "string" } },
      { id: "shorthand", label: "Shorthand", valueType: { type: "boolean" } },
    ],
  },
});
export const run = npmWorkspaceSpecifierPrefixTool.execute;
export default npmWorkspaceSpecifierPrefixTool;
