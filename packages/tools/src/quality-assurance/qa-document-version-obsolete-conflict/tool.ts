import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly version: string;
  readonly effectiveVersion: string;
  readonly obsolete: boolean;
  readonly active: boolean;
};
export type Output = {
  readonly matchesEffective: boolean;
  readonly conflictingStatus: boolean;
  readonly staleActive: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    version: { type: "string", maxLength: 8192 },
    effectiveVersion: { type: "string", maxLength: 8192 },
    obsolete: { type: "boolean" },
    active: { type: "boolean" },
  },
  required: ["version", "effectiveVersion", "obsolete", "active"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matchesEffective: { type: "boolean" },
    conflictingStatus: { type: "boolean" },
    staleActive: { type: "boolean" },
  },
  required: ["matchesEffective", "conflictingStatus", "staleActive"],
} as const;
/** Audit supplied document-version and status flag consistency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { version, effectiveVersion, obsolete, active } = request;
  const compute = (): Output => {
    return {
      matchesEffective: version === effectiveVersion,
      conflictingStatus: obsolete && active,
      staleActive: active && version !== effectiveVersion,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    version: "v1",
    effectiveVersion: "v2",
    obsolete: true,
    active: true,
  },
  output: {
    matchesEffective: false,
    conflictingStatus: true,
    staleActive: true,
  },
} satisfies ToolExample<Input, Output>;
export const qaDocumentVersionObsoleteConflictTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-assurance/qa-document-version-obsolete-conflict",
    title: "QA Document Version Obsolete Conflict Tool",
    description: "Audit supplied document-version and status flag consistency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        version: { type: "string", maxLength: 8192 },
        effectiveVersion: { type: "string", maxLength: 8192 },
        obsolete: { type: "boolean" },
        active: { type: "boolean" },
      },
      required: ["version", "effectiveVersion", "obsolete", "active"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matchesEffective: { type: "boolean" },
        conflictingStatus: { type: "boolean" },
        staleActive: { type: "boolean" },
      },
      required: ["matchesEffective", "conflictingStatus", "staleActive"],
    },
    ports: {
      inputs: [
        {
          id: "version",
          label: "Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "effectiveVersion",
          label: "Effective Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "obsolete",
          label: "Obsolete",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "active",
          label: "Active",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "matchesEffective",
          label: "Matches Effective",
          valueType: { type: "boolean" },
        },
        {
          id: "conflictingStatus",
          label: "Conflicting Status",
          valueType: { type: "boolean" },
        },
        {
          id: "staleActive",
          label: "Stale Active",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = qaDocumentVersionObsoleteConflictTool.execute;
export default qaDocumentVersionObsoleteConflictTool;
