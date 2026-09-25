import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly localName: string;
  readonly packageName: string;
};
export type Output = {
  readonly renamed: boolean;
  readonly cargoFeaturePrefix: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localName: { type: "string", maxLength: 8192 },
    packageName: { type: "string", maxLength: 8192 },
  },
  required: ["localName", "packageName"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    renamed: { type: "boolean" },
    cargoFeaturePrefix: { type: "string", maxLength: 8192 },
  },
  required: ["renamed", "cargoFeaturePrefix"],
} as const;
/** Compute cargo dependency rename package pair from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { localName, packageName } = input;
  const compute = (): Output => {
    domain(
      /^[A-Za-z0-9_-]+(?![\s\S])/.test(localName) &&
        /^[A-Za-z0-9_-]+(?![\s\S])/.test(packageName),
    );
    return {
      renamed: localName !== packageName,
      cargoFeaturePrefix: "dep:" + localName,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { localName: "serde1", packageName: "serde" },
  output: { renamed: true, cargoFeaturePrefix: "dep:serde1" },
} satisfies ToolExample<Input, Output>;
export const cargoDependencyRenamePackagePairTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "development/cargo-dependency-rename-package-pair",
  title: "Cargo Dependency Rename Package Pair Tool",
  description:
    "Compute cargo dependency rename package pair from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "localName",
        label: "Local Name",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "packageName",
        label: "Package Name",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "renamed", label: "Renamed", valueType: { type: "boolean" } },
      {
        id: "cargoFeaturePrefix",
        label: "Cargo Feature Prefix",
        valueType: { type: "string" },
      },
    ],
  },
});
export const run = cargoDependencyRenamePackagePairTool.execute;
export default cargoDependencyRenamePackagePairTool;
