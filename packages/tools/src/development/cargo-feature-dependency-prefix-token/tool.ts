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
  readonly dependency: string;
  readonly feature: string;
  readonly optional: boolean;
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
    dependency: { type: "string", maxLength: 8192 },
    feature: { type: "string", maxLength: 8192 },
    optional: { type: "boolean" },
  },
  required: ["dependency", "feature", "optional"],
} as const;
/** Compute cargo feature dependency prefix token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    const m =
      /^(?:dep:([A-Za-z0-9_-]+)|([A-Za-z0-9_-]+)(\?)?\/([A-Za-z0-9_-]+))(?![\s\S])/.exec(
        token,
      );
    domain(m);
    return { dependency: m[1] ?? m[2], feature: m[4] ?? "", optional: !!m[3] };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "serde?/derive" },
  output: { dependency: "serde", feature: "derive", optional: true },
} satisfies ToolExample<Input, Output>;
export const cargoFeatureDependencyPrefixTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "development/cargo-feature-dependency-prefix-token",
  title: "Cargo Feature Dependency Prefix Token Tool",
  description:
    "Compute cargo feature dependency prefix token from explicit bounded inputs.",
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
      { id: "dependency", label: "Dependency", valueType: { type: "string" } },
      { id: "feature", label: "Feature", valueType: { type: "string" } },
      { id: "optional", label: "Optional", valueType: { type: "boolean" } },
    ],
  },
});
export const run = cargoFeatureDependencyPrefixTokenTool.execute;
export default cargoFeatureDependencyPrefixTokenTool;
