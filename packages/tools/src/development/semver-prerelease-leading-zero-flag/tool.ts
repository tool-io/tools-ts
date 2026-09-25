import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly identifier: string };
export type Output = {
  readonly numeric: boolean;
  readonly invalidLeadingZero: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { identifier: { type: "string", maxLength: 8192 } },
  required: ["identifier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numeric: { type: "boolean" },
    invalidLeadingZero: { type: "boolean" },
  },
  required: ["numeric", "invalidLeadingZero"],
} as const;
/** Compute semver prerelease leading zero flag from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { identifier } = input;
  const compute = (): Output => {
    domain(/^[0-9A-Za-z-]+(?![\s\S])/.test(identifier));
    const numeric = /^\d+(?![\s\S])/.test(identifier);
    return {
      numeric,
      invalidLeadingZero:
        numeric && identifier.length > 1 && identifier[0] === "0",
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { identifier: "01" },
  output: { numeric: true, invalidLeadingZero: true },
} satisfies ToolExample<Input, Output>;
export const semverPrereleaseLeadingZeroFlagTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "development/semver-prerelease-leading-zero-flag",
  title: "SemVer Prerelease Leading Zero Flag Tool",
  description:
    "Compute semver prerelease leading zero flag from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "identifier",
        label: "Identifier",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "numeric", label: "Numeric", valueType: { type: "boolean" } },
      {
        id: "invalidLeadingZero",
        label: "Invalid Leading Zero",
        valueType: { type: "boolean" },
      },
    ],
  },
});
export const run = semverPrereleaseLeadingZeroFlagTool.execute;
export default semverPrereleaseLeadingZeroFlagTool;
