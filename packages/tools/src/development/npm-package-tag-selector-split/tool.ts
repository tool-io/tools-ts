import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly specifier: string };
export type Output = { readonly name: string; readonly selector: string };
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
    name: { type: "string", maxLength: 8192 },
    selector: { type: "string", maxLength: 8192 },
  },
  required: ["name", "selector"],
} as const;
/** Compute npm package tag selector split from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { specifier } = input;
  const compute = (): Output => {
    const m = /^(@[^/\s@]+\/[^\s@]+|[^/@\s]+)@([^\s@]+)(?![\s\S])/.exec(
      specifier,
    );
    domain(m);
    return { name: m[1], selector: m[2] };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { specifier: "@scope/name@next" },
  output: { name: "@scope/name", selector: "next" },
} satisfies ToolExample<Input, Output>;
export const npmPackageTagSelectorSplitTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "development/npm-package-tag-selector-split",
  title: "npm Package Tag Selector Split Tool",
  description:
    "Compute npm package tag selector split from explicit bounded inputs.",
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
      { id: "name", label: "Name", valueType: { type: "string" } },
      { id: "selector", label: "Selector", valueType: { type: "string" } },
    ],
  },
});
export const run = npmPackageTagSelectorSplitTool.execute;
export default npmPackageTagSelectorSplitTool;
