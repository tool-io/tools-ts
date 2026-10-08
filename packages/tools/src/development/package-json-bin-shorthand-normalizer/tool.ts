import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly packageName: string; readonly binPath: string };
export type Output = { readonly commandName: string; readonly binPath: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packageName: { type: "string", maxLength: 8192 },
    binPath: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["packageName", "binPath"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    commandName: { type: "string", maxLength: 8192 },
    binPath: { type: "string", maxLength: 8192 },
  },
  required: ["commandName", "binPath"],
} as const;
/** Normalize an explicit package bin shorthand into an unscoped command name and unchanged executable path. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { packageName, binPath } = request;
  const compute = (): Output => {
    H.domain(
      /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*(?![\s\S])/.test(
        packageName,
      ),
      "packageName",
    );
    H.domain(binPath.length > 0, "binPath");
    return {
      commandName: packageName.includes("/")
        ? packageName.slice(packageName.lastIndexOf("/") + 1)
        : packageName,
      binPath,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { packageName: "@scope/cli-tool", binPath: "./cli.js" },
  output: { commandName: "cli-tool", binPath: "./cli.js" },
} satisfies ToolExample<Input, Output>;
export const packageJsonBinShorthandNormalizerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["development", "software development", "computer science"],
      keywords: ["software development", "computer science"],
    },
    id: "development/package-json-bin-shorthand-normalizer",
    title: "Package JSON Bin Shorthand Normalizer",
    description:
      "Normalize an explicit package bin shorthand into an unscoped command name and unchanged executable path.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        packageName: { type: "string", maxLength: 8192 },
        binPath: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["packageName", "binPath"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        commandName: { type: "string", maxLength: 8192 },
        binPath: { type: "string", maxLength: 8192 },
      },
      required: ["commandName", "binPath"],
    },
    ports: {
      inputs: [
        {
          id: "packageName",
          label: "Package Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "binPath",
          label: "Bin Path",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "commandName",
          label: "Command Name",
          valueType: { type: "string" },
        },
        { id: "binPath", label: "Bin Path", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = packageJsonBinShorthandNormalizerTool.execute;
export default packageJsonBinShorthandNormalizerTool;
