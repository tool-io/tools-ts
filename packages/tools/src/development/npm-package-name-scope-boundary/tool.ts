import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly name: string };
export type Output = {
  readonly scope: string;
  readonly package: string;
  readonly scoped: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { name: { type: "string", maxLength: 8192 } },
  required: ["name"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scope: { type: "string", maxLength: 8192 },
    package: { type: "string", maxLength: 8192 },
    scoped: { type: "boolean" },
  },
  required: ["scope", "package", "scoped"],
} as const;
/** Calculate npm package name scope boundary from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { name } = input;
  const compute = (): Output => {
    H.domain(
      /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*(?![\s\S])/.test(name),
    );
    const scoped = name.startsWith("@"),
      slash = name.indexOf("/");
    return {
      scope: scoped ? name.slice(1, slash) : "",
      package: scoped ? name.slice(slash + 1) : name,
      scoped,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { name: "@tool/example" },
  output: { scope: "tool", package: "example", scoped: true },
} satisfies ToolExample<Input, Output>;
export const npmPackageNameScopeBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "development/npm-package-name-scope-boundary",
    title: "npm Package Name Scope Boundary Tool",
    description:
      "Calculate npm package name scope boundary from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { name: { type: "string", maxLength: 8192 } },
      required: ["name"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scope: { type: "string", maxLength: 8192 },
        package: { type: "string", maxLength: 8192 },
        scoped: { type: "boolean" },
      },
      required: ["scope", "package", "scoped"],
    },
    ports: {
      inputs: [
        {
          id: "name",
          label: "Name",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "scope", label: "Scope", valueType: { type: "string" } },
        { id: "package", label: "Package", valueType: { type: "string" } },
        { id: "scoped", label: "Scoped", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = npmPackageNameScopeBoundaryTool.execute;
export default npmPackageNameScopeBoundaryTool;
