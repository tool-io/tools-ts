import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly code: string;
  readonly expectedSource: string;
  readonly actualSource: string;
  readonly knownCodes: readonly string[];
};
export type Output = {
  readonly codeListed: boolean;
  readonly sameSource: boolean;
  readonly usableUnderTokens: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    code: { type: "string", maxLength: 8192 },
    expectedSource: { type: "string", maxLength: 8192 },
    actualSource: { type: "string", maxLength: 8192 },
    knownCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["code", "expectedSource", "actualSource", "knownCodes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    codeListed: { type: "boolean" },
    sameSource: { type: "boolean" },
    usableUnderTokens: { type: "boolean" },
  },
  required: ["codeListed", "sameSource", "usableUnderTokens"],
} as const;
/** Compare supplied unit code and source tokens without inventing a conversion table. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { code, expectedSource, actualSource, knownCodes } = request;
  const compute = (): Output => {
    const codeListed = knownCodes.includes(code),
      sameSource = expectedSource === actualSource;
    return {
      codeListed,
      sameSource,
      usableUnderTokens: codeListed && sameSource,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    code: "ha",
    expectedSource: "A",
    actualSource: "A",
    knownCodes: ["ha", "m2"],
  },
  output: { codeListed: true, sameSource: true, usableUnderTokens: true },
} satisfies ToolExample<Input, Output>;
export const agriculturalUnitCodeSourceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroinformatics/agricultural-unit-code-source-gap",
    title: "Agricultural Unit Code Source Gap Tool",
    description:
      "Compare supplied unit code and source tokens without inventing a conversion table.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        code: { type: "string", maxLength: 8192 },
        expectedSource: { type: "string", maxLength: 8192 },
        actualSource: { type: "string", maxLength: 8192 },
        knownCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["code", "expectedSource", "actualSource", "knownCodes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        codeListed: { type: "boolean" },
        sameSource: { type: "boolean" },
        usableUnderTokens: { type: "boolean" },
      },
      required: ["codeListed", "sameSource", "usableUnderTokens"],
    },
    ports: {
      inputs: [
        {
          id: "code",
          label: "Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedSource",
          label: "Expected Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "actualSource",
          label: "Actual Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "knownCodes",
          label: "Known Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "codeListed",
          label: "Code Listed",
          valueType: { type: "boolean" },
        },
        {
          id: "sameSource",
          label: "Same Source",
          valueType: { type: "boolean" },
        },
        {
          id: "usableUnderTokens",
          label: "Usable Under Tokens",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = agriculturalUnitCodeSourceGapTool.execute;
export default agriculturalUnitCodeSourceGapTool;
