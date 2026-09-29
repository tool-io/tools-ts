import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestedPurpose: string;
  readonly allowedPurposes: readonly string[];
  readonly permissionKnown: boolean;
  readonly permissionGranted: boolean;
  readonly source: string;
};
export type Output = {
  readonly listed: boolean;
  readonly permittedUnderFlags: boolean;
  readonly unresolved: boolean;
  readonly source: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestedPurpose: { type: "string", maxLength: 8192 },
    allowedPurposes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    permissionKnown: { type: "boolean" },
    permissionGranted: { type: "boolean" },
    source: { type: "string", maxLength: 8192 },
  },
  required: [
    "requestedPurpose",
    "allowedPurposes",
    "permissionKnown",
    "permissionGranted",
    "source",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    listed: { type: "boolean" },
    permittedUnderFlags: { type: "boolean" },
    unresolved: { type: "boolean" },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["listed", "permittedUnderFlags", "unresolved", "source"],
} as const;
/** Inspect caller-supplied access-purpose/permission metadata without granting access or disclosing restricted content. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    requestedPurpose,
    allowedPurposes,
    permissionKnown,
    permissionGranted,
    source,
  } = request;
  const compute = (): Output => {
    const listed = allowedPurposes.includes(requestedPurpose);
    return {
      listed,
      permittedUnderFlags: listed && permissionKnown && permissionGranted,
      unresolved: !permissionKnown,
      source,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requestedPurpose: "study",
    allowedPurposes: ["study"],
    permissionKnown: true,
    permissionGranted: true,
    source: "policy-A",
  },
  output: {
    listed: true,
    permittedUnderFlags: true,
    unresolved: false,
    source: "policy-A",
  },
} satisfies ToolExample<Input, Output>;
export const authorizedItemAccessScopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "indigenous-studies/authorized-item-access-scope",
    title: "Authorized Item Access Scope Tool",
    description:
      "Inspect caller-supplied access-purpose/permission metadata without granting access or disclosing restricted content.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestedPurpose: { type: "string", maxLength: 8192 },
        allowedPurposes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        permissionKnown: { type: "boolean" },
        permissionGranted: { type: "boolean" },
        source: { type: "string", maxLength: 8192 },
      },
      required: [
        "requestedPurpose",
        "allowedPurposes",
        "permissionKnown",
        "permissionGranted",
        "source",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        listed: { type: "boolean" },
        permittedUnderFlags: { type: "boolean" },
        unresolved: { type: "boolean" },
        source: { type: "string", maxLength: 8192 },
      },
      required: ["listed", "permittedUnderFlags", "unresolved", "source"],
    },
    ports: {
      inputs: [
        {
          id: "requestedPurpose",
          label: "Requested Purpose",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allowedPurposes",
          label: "Allowed Purposes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "permissionKnown",
          label: "Permission Known",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "permissionGranted",
          label: "Permission Granted",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "listed", label: "Listed", valueType: { type: "boolean" } },
        {
          id: "permittedUnderFlags",
          label: "Permitted Under Flags",
          valueType: { type: "boolean" },
        },
        {
          id: "unresolved",
          label: "Unresolved",
          valueType: { type: "boolean" },
        },
        { id: "source", label: "Source", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = authorizedItemAccessScopeTool.execute;
export default authorizedItemAccessScopeTool;
