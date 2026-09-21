import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly purpose: string;
  readonly permitted: readonly string[];
  readonly exceptionPurposes: readonly string[];
  readonly exceptionAuthorized: boolean;
};
export type Output = {
  readonly permittedByTokens: boolean;
  readonly exceptionUsed: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    purpose: { type: "string", maxLength: 8192 },
    permitted: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    exceptionPurposes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    exceptionAuthorized: { type: "boolean" },
  },
  required: [
    "purpose",
    "permitted",
    "exceptionPurposes",
    "exceptionAuthorized",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    permittedByTokens: { type: "boolean" },
    exceptionUsed: { type: "boolean" },
  },
  required: ["permittedByTokens", "exceptionUsed"],
} as const;
/** Evaluate caller-supplied exception-purpose flags; does not establish confidentiality law or release records. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { purpose, permitted, exceptionPurposes, exceptionAuthorized } =
    request;
  const compute = (): Output => {
    const normal = permitted.includes(purpose),
      exceptionUsed =
        !normal && exceptionAuthorized && exceptionPurposes.includes(purpose);
    return { permittedByTokens: normal || exceptionUsed, exceptionUsed };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    purpose: "audit",
    permitted: ["care"],
    exceptionPurposes: ["audit"],
    exceptionAuthorized: true,
  },
  output: { permittedByTokens: true, exceptionUsed: true },
} satisfies ToolExample<Input, Output>;
export const confidentialityExceptionScopeTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "applied-ethics/confidentiality-exception-scope-token",
    title: "Confidentiality Exception Scope Token Tool",
    description:
      "Evaluate caller-supplied exception-purpose flags; does not establish confidentiality law or release records.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        purpose: { type: "string", maxLength: 8192 },
        permitted: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        exceptionPurposes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        exceptionAuthorized: { type: "boolean" },
      },
      required: [
        "purpose",
        "permitted",
        "exceptionPurposes",
        "exceptionAuthorized",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        permittedByTokens: { type: "boolean" },
        exceptionUsed: { type: "boolean" },
      },
      required: ["permittedByTokens", "exceptionUsed"],
    },
    ports: {
      inputs: [
        {
          id: "purpose",
          label: "Purpose",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "permitted",
          label: "Permitted",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "exceptionPurposes",
          label: "Exception Purposes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "exceptionAuthorized",
          label: "Exception Authorized",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "permittedByTokens",
          label: "Permitted By Tokens",
          valueType: { type: "boolean" },
        },
        {
          id: "exceptionUsed",
          label: "Exception Used",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = confidentialityExceptionScopeTokenTool.execute;
export default confidentialityExceptionScopeTokenTool;
