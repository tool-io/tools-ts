import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type StorageHeadroomClass =
  | "critical"
  | "healthy"
  | "low"
  | "unknown";

export type StorageCheckInput = {
  /** Total bytes the surface is allowed to persist. */
  readonly quotaBytes?: number;
  /** Whether persistent storage has been granted. */
  readonly persisted?: boolean;
  /** Bytes currently persisted by the origin or app. */
  readonly usageBytes?: number;
};

export type StorageCheckOutput = {
  readonly freeBytes: number | null;
  readonly headroomClass: StorageHeadroomClass;
  readonly issues: readonly string[];
  readonly persisted: boolean | null;
  readonly usedPercent: number | null;
};

const LOW_SPACE_PERCENT = 20;
const CRITICAL_SPACE_PERCENT = 5;

export const storageCheckInputSchema = {
  additionalProperties: false,
  properties: {
    persisted: {
      description: "Whether persistent storage has been granted.",
      type: "boolean",
    },
    quotaBytes: {
      description: "Total persistable bytes reported by the surface.",
      minimum: 0,
      type: "integer",
    },
    usageBytes: {
      description: "Persisted bytes currently in use.",
      minimum: 0,
      type: "integer",
    },
  },
  type: "object",
} as const;

export const storageCheckOutputSchema = {
  additionalProperties: false,
  properties: {
    freeBytes: {
      anyOf: [{ type: "null" }, { minimum: 0, type: "integer" }],
      description: "Quota bytes not yet used.",
    },
    headroomClass: {
      description: "Remaining-space classification.",
      enum: ["critical", "healthy", "low", "unknown"],
      type: "string",
    },
    issues: {
      description: "Stable machine-facing degradation codes.",
      items: { type: "string" },
      type: "array",
    },
    persisted: {
      anyOf: [{ type: "null" }, { type: "boolean" }],
      description: "Whether persistent storage has been granted.",
    },
    usedPercent: {
      anyOf: [{ type: "null" }, { maximum: 100, minimum: 0, type: "number" }],
      description: "Share of quota currently used.",
    },
  },
  required: [
    "usedPercent",
    "freeBytes",
    "headroomClass",
    "persisted",
    "issues",
  ],
  type: "object",
} as const;

export const storageCheckExample = {
  input: {
    persisted: true,
    quotaBytes: 100000000,
    usageBytes: 25000000,
  },
  output: {
    freeBytes: 75000000,
    headroomClass: "healthy",
    issues: [],
    persisted: true,
    usedPercent: 25,
  },
} satisfies ToolExample<StorageCheckInput, StorageCheckOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isStorageCheckOutput = (
  value: unknown,
): value is StorageCheckOutput =>
  isRecord(value) &&
  typeof value.headroomClass === "string" &&
  Array.isArray(value.issues) &&
  value.issues.every((issue) => typeof issue === "string");

const byteIssues = (
  field: string,
  code: string,
  value: unknown,
): ToolIssue | undefined =>
  value !== undefined &&
  (!Number.isSafeInteger(value) || (value as number) < 0)
    ? {
        code,
        field,
        message: `${field} must be a nonnegative safe integer.`,
      }
    : undefined;

export const calculateStorageCheck = (
  input: unknown,
): ToolResult<StorageCheckOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const knownFields = new Set(["persisted", "quotaBytes", "usageBytes"]);
  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (!knownFields.has(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  for (const [field, invalidCode] of [
    ["quotaBytes", "quota_bytes_invalid"],
    ["usageBytes", "usage_bytes_invalid"],
  ] as const) {
    const issue = byteIssues(field, invalidCode, input[field]);
    if (issue) issues.push(issue);
  }

  const persisted = input.persisted;
  if (persisted !== undefined && typeof persisted !== "boolean")
    issues.push({
      code: "persisted_invalid",
      field: "persisted",
      message: "persisted must be a boolean.",
    });

  const quota = input.quotaBytes as number | undefined;
  const usage = input.usageBytes as number | undefined;
  if (
    quota !== undefined &&
    usage !== undefined &&
    !issues.some((issue) =>
      ["quotaBytes", "usageBytes"].includes(issue.field),
    ) &&
    usage > quota
  )
    issues.push({
      code: "usage_exceeds_quota",
      field: "usageBytes",
      message: "usageBytes cannot exceed quotaBytes.",
    });

  if (issues.length > 0) return invalidInput(issues);

  const quotaKnown =
    input.quotaBytes !== undefined && (input.quotaBytes as number) > 0;
  const usedPercent =
    !quotaKnown || usage === undefined
      ? null
      : ((usage / (input.quotaBytes as number)) * 100);
  const freeBytes =
    !quotaKnown || usage === undefined
      ? null
      : (input.quotaBytes as number) - usage;

  const outputIssues: string[] = [];
  let headroomClass: StorageHeadroomClass;
  if (!quotaKnown) {
    headroomClass = "unknown";
    outputIssues.push("quota-unavailable");
  } else if ((usedPercent as number) > 100 - CRITICAL_SPACE_PERCENT) {
    headroomClass = "critical";
    outputIssues.push("critical-space");
  } else if ((usedPercent as number) > 100 - LOW_SPACE_PERCENT) {
    headroomClass = "low";
    outputIssues.push("low-space");
  } else {
    headroomClass = "healthy";
  }

  return toolSuccess({
    freeBytes,
    headroomClass,
    issues: outputIssues,
    persisted: persisted === undefined ? null : (persisted as boolean),
    usedPercent,
  });
};

export const storageCheckTool = defineTool<StorageCheckInput, StorageCheckOutput>({
  contractVersion: 1,
  description:
    "Assess storage health from a usage probe, reporting headroom classification and warnings.",
  discovery: {
    aliases: ["disk-check", "space-check", "storage-check"],
    keywords: ["disk", "quota", "space", "storage", "usage"],
  },
  execute: calculateStorageCheck,
  execution: { kind: "pure" },
  id: "check/storage",
  inputSchema: storageCheckInputSchema,
  outputSchema: storageCheckOutputSchema,
  ports: {
    inputs: [
      {
        description: "Storage probe supplied by the surface.",
        id: "probe",
        label: "Storage probe",
        path: [],
        required: true,
        valueType: { format: "device-probe/storage", type: "object" },
      },
    ],
    outputs: [
      {
        description: "Share of quota currently used.",
        id: "usedPercent",
        label: "Used",
        valueType: { format: "ratio-percent", type: "number", unit: "%" },
      },
      {
        description: "Quota bytes not yet used.",
        id: "freeBytes",
        label: "Free space",
        valueType: { format: "data-size", type: "integer", unit: "B" },
      },
      {
        description: "Remaining-space classification.",
        id: "headroomClass",
        label: "Headroom",
        valueType: { format: "storage-headroom", type: "string" },
      },
      {
        description: "Whether persistent storage has been granted.",
        id: "persisted",
        label: "Persisted",
        valueType: { type: "boolean" },
      },
      {
        description: "Stable machine-facing degradation codes.",
        id: "issues",
        label: "Issues",
        valueType: {
          format: "issue-codes",
          items: { type: "string" },
          type: "list",
        },
      },
    ],
  },
  title: "Storage Checker",
});

export const runStorageCheck = storageCheckTool.execute;
export default storageCheckTool;
