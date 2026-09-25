import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly identifier: string };
export type Output = { readonly base: string; readonly orLater: boolean };
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
    base: { type: "string", maxLength: 8192 },
    orLater: { type: "boolean" },
  },
  required: ["base", "orLater"],
} as const;
/** Split the legacy SPDX identifier plus marker lexically without asserting membership in a license list. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { identifier } = input;
  const compute = (): Output => {
    H.domain(/^[A-Za-z0-9][A-Za-z0-9.-]*\+?(?![\s\S])/.test(identifier));
    const orLater = identifier.endsWith("+");
    return { base: orLater ? identifier.slice(0, -1) : identifier, orLater };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { identifier: "GPL-2.0+" },
  output: { base: "GPL-2.0", orLater: true },
} satisfies ToolExample<Input, Output>;
export const licenseExpressionPlusOrLaterTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "development/license-expression-plus-or-later-token",
    title: "License Expression Plus OR Later Token Tool",
    description:
      "Split the legacy SPDX identifier plus marker lexically without asserting membership in a license list.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { identifier: { type: "string", maxLength: 8192 } },
      required: ["identifier"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        base: { type: "string", maxLength: 8192 },
        orLater: { type: "boolean" },
      },
      required: ["base", "orLater"],
    },
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
        { id: "base", label: "Base", valueType: { type: "string" } },
        { id: "orLater", label: "Or Later", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = licenseExpressionPlusOrLaterTokenTool.execute;
export default licenseExpressionPlusOrLaterTokenTool;
