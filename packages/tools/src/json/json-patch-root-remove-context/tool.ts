import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly path: string;
  readonly operation: string;
  readonly rootPresent: boolean;
  readonly rootRemovalPolicy: string;
};
export type Output = {
  readonly removesDocument: boolean;
  readonly applicable: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    path: { type: "string", maxLength: 8192 },
    operation: {
      type: "string",
      maxLength: 8192,
      enum: ["remove", "add", "replace", "test", "copy", "move"],
    },
    rootPresent: { type: "boolean" },
    rootRemovalPolicy: {
      type: "string",
      maxLength: 8192,
      enum: ["allow-document-absence", "reject"],
    },
  },
  required: ["path", "operation", "rootPresent", "rootRemovalPolicy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    removesDocument: { type: "boolean" },
    applicable: { type: "boolean" },
  },
  required: ["removesDocument", "applicable"],
} as const;
/** Identify root removal and evaluate an explicit application policy for representing document absence. No JSON value is substituted for an absent document. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { path, operation, rootPresent, rootRemovalPolicy } = request;
  const compute = (): Output => {
    H.domain(["allow-document-absence", "reject"].includes(rootRemovalPolicy));
    H.domain(
      ["remove", "add", "replace", "test", "copy", "move"].includes(operation),
    );
    const removesDocument = operation === "remove" && path === "";
    return {
      removesDocument,
      applicable:
        removesDocument &&
        rootPresent &&
        rootRemovalPolicy === "allow-document-absence",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    path: "",
    operation: "remove",
    rootPresent: true,
    rootRemovalPolicy: "allow-document-absence",
  },
  output: { removesDocument: true, applicable: true },
} satisfies ToolExample<Input, Output>;
export const jsonPatchRootRemoveContextTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "json/json-patch-root-remove-context",
    title: "JSON Patch Root Remove Context Tool",
    description:
      "Identify root removal and evaluate an explicit application policy for representing document absence. No JSON value is substituted for an absent document.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        path: { type: "string", maxLength: 8192 },
        operation: {
          type: "string",
          maxLength: 8192,
          enum: ["remove", "add", "replace", "test", "copy", "move"],
        },
        rootPresent: { type: "boolean" },
        rootRemovalPolicy: {
          type: "string",
          maxLength: 8192,
          enum: ["allow-document-absence", "reject"],
        },
      },
      required: ["path", "operation", "rootPresent", "rootRemovalPolicy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        removesDocument: { type: "boolean" },
        applicable: { type: "boolean" },
      },
      required: ["removesDocument", "applicable"],
    },
    ports: {
      inputs: [
        {
          id: "path",
          label: "Path",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "operation",
          label: "Operation",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "rootPresent",
          label: "Root Present",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "rootRemovalPolicy",
          label: "Root Removal Policy",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "removesDocument",
          label: "Removes Document",
          valueType: { type: "boolean" },
        },
        {
          id: "applicable",
          label: "Applicable",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = jsonPatchRootRemoveContextTool.execute;
export default jsonPatchRootRemoveContextTool;
