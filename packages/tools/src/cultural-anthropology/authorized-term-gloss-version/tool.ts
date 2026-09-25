import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly term: string;
  readonly gloss: string;
  readonly suppliedVersion: string;
  readonly requiredVersion: string;
  readonly authorized: boolean;
};
export type Output = {
  readonly currentAuthorized: boolean;
  readonly preservedKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    term: { type: "string", maxLength: 8192 },
    gloss: { type: "string", maxLength: 8192 },
    suppliedVersion: { type: "string", maxLength: 8192 },
    requiredVersion: { type: "string", maxLength: 8192 },
    authorized: { type: "boolean" },
  },
  required: [
    "term",
    "gloss",
    "suppliedVersion",
    "requiredVersion",
    "authorized",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentAuthorized: { type: "boolean" },
    preservedKey: { type: "string", maxLength: 8192 },
  },
  required: ["currentAuthorized", "preservedKey"],
} as const;
/** Retain a supplied authorized gloss and version without translating or standardizing a cultural term. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { term, gloss, suppliedVersion, requiredVersion, authorized } = request;
  const compute = (): Output => {
    return {
      currentAuthorized: authorized && suppliedVersion === requiredVersion,
      preservedKey: JSON.stringify([term, gloss, suppliedVersion]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    term: "term-A",
    gloss: "gloss-A",
    suppliedVersion: "v2",
    requiredVersion: "v2",
    authorized: true,
  },
  output: {
    currentAuthorized: true,
    preservedKey: '["term-A","gloss-A","v2"]',
  },
} satisfies ToolExample<Input, Output>;
export const authorizedTermGlossVersionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-anthropology/authorized-term-gloss-version",
    title: "Authorized Term Gloss Version Tool",
    description:
      "Retain a supplied authorized gloss and version without translating or standardizing a cultural term.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        term: { type: "string", maxLength: 8192 },
        gloss: { type: "string", maxLength: 8192 },
        suppliedVersion: { type: "string", maxLength: 8192 },
        requiredVersion: { type: "string", maxLength: 8192 },
        authorized: { type: "boolean" },
      },
      required: [
        "term",
        "gloss",
        "suppliedVersion",
        "requiredVersion",
        "authorized",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentAuthorized: { type: "boolean" },
        preservedKey: { type: "string", maxLength: 8192 },
      },
      required: ["currentAuthorized", "preservedKey"],
    },
    ports: {
      inputs: [
        {
          id: "term",
          label: "Term",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "gloss",
          label: "Gloss",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedVersion",
          label: "Supplied Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "requiredVersion",
          label: "Required Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "authorized",
          label: "Authorized",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "currentAuthorized",
          label: "Current Authorized",
          valueType: { type: "boolean" },
        },
        {
          id: "preservedKey",
          label: "Preserved Key",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = authorizedTermGlossVersionTool.execute;
export default authorizedTermGlossVersionTool;
