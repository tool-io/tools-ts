import { parsePlainDate, millisecondsPerDay } from "../../core/date.js";
import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { toolResourceLimits } from "../../core/limits.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";

export type DormantVendorEntry = {
  readonly lastActivity: string;
  readonly vendor: string;
};

export type DormantVendorInput = {
  readonly asOf: string;
  readonly dormantDays: number;
  readonly vendors: ReadonlyArray<DormantVendorEntry>;
};

export type DormantVendorOutput = {
  readonly dormantIndices: ReadonlyArray<number>;
  readonly dormantVendors: number;
  readonly oldestDormantDays: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const simpleFailure = (error: SimpleToolError): ToolResult<never> =>
  invalidInput([
    { code: error.code, field: error.field, message: error.message },
  ]);

const parseVendorDate = (
  value: string,
  field: string,
  code: string,
): number => {
  try {
    return parsePlainDate(value, field);
  } catch (error) {
    if (error instanceof SimpleToolError)
      simpleError(field, error.message, code);
    throw error;
  }
};

export const findDormantVendors = (
  input: DormantVendorInput,
): DormantVendorOutput => {
  const asOf = parseVendorDate(input.asOf, "asOf", "invalid_as_of_date");
  if (!Number.isSafeInteger(input.dormantDays) || input.dormantDays < 1)
    simpleError(
      "dormantDays",
      "The dormancy threshold must be a positive whole number of days.",
      "invalid_dormant_days",
    );
  if (!Array.isArray(input.vendors))
    simpleError("vendors", "Vendors must be an array.", "vendors_required");
  if (input.vendors.length > toolResourceLimits.generatedValues)
    simpleError(
      "vendors",
      `Vendors must not contain more than ${toolResourceLimits.generatedValues} entries.`,
      "resource_limit_exceeded",
    );

  const dormantIndices: number[] = [];
  let oldestDormantDays = 0;
  for (const [index, entry] of input.vendors.entries()) {
    if (typeof entry?.vendor !== "string" || entry.vendor.trim() === "")
      simpleError(
        `vendors.${index}.vendor`,
        "Each vendor must have a nonempty name.",
        "invalid_vendor_name",
      );
    if (typeof entry?.lastActivity !== "string")
      simpleError(
        `vendors.${index}.lastActivity`,
        "Each vendor must have a last-activity date in YYYY-MM-DD format.",
        "invalid_last_activity",
      );
    const lastActivity = parseVendorDate(
      entry.lastActivity,
      `vendors.${index}.lastActivity`,
      "invalid_last_activity",
    );
    if (lastActivity > asOf)
      simpleError(
        `vendors.${index}.lastActivity`,
        "Last activity must not be after the as-of date.",
        "activity_after_as_of",
      );
    const inactiveDays = (asOf - lastActivity) / millisecondsPerDay;
    if (inactiveDays >= input.dormantDays) {
      dormantIndices.push(index);
      oldestDormantDays = Math.max(oldestDormantDays, inactiveDays);
    }
  }
  return {
    dormantIndices,
    dormantVendors: dormantIndices.length,
    oldestDormantDays,
  };
};

export const dormantVendorExample = {
  input: {
    asOf: "2026-01-01",
    dormantDays: 365,
    vendors: [
      { lastActivity: "2024-06-15", vendor: "Legacy Parts Co" },
      { lastActivity: "2025-12-20", vendor: "Fresh Office Supply" },
      { lastActivity: "2025-01-15", vendor: "New Equipment Vendor" },
    ],
  },
  output: {
    dormantIndices: [0],
    dormantVendors: 1,
    oldestDormantDays: 565,
  },
} satisfies ToolExample<DormantVendorInput, DormantVendorOutput>;

const executeDormantVendor = (
  input: unknown,
): ToolResult<DormantVendorOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  const unknownField = Object.keys(input).find(
    (field) =>
      field !== "asOf" && field !== "dormantDays" && field !== "vendors",
  );
  if (unknownField !== undefined)
    return invalidInput([
      {
        code: "unknown_field",
        field: unknownField,
        message: `${unknownField} is not a supported input field.`,
      },
    ]);
  if (typeof input.asOf !== "string")
    return invalidInput([
      {
        code: "invalid_field",
        field: "asOf",
        message: "As-of date must be text in YYYY-MM-DD format.",
      },
    ]);
  if (
    typeof input.dormantDays !== "number" ||
    !Number.isSafeInteger(input.dormantDays) ||
    input.dormantDays < 1
  )
    return invalidInput([
      {
        code: "invalid_dormant_days",
        field: "dormantDays",
        message: "Dormancy threshold must be a positive whole number of days.",
      },
    ]);
  if (!Array.isArray(input.vendors))
    return invalidInput([
      {
        code: "vendors_required",
        field: "vendors",
        message: "Vendors must be an array.",
      },
    ]);
  if (input.vendors.length > toolResourceLimits.generatedValues)
    return invalidInput([
      {
        code: "resource_limit_exceeded",
        field: "vendors",
        message: `Vendors must not contain more than ${toolResourceLimits.generatedValues} entries.`,
      },
    ]);

  const vendors: DormantVendorEntry[] = [];
  for (const [index, entry] of input.vendors.entries()) {
    if (!isRecord(entry))
      return invalidInput([
        {
          code: "invalid_vendor",
          field: `vendors.${index}`,
          message: "Each vendor must be an object.",
        },
      ]);
    const unknownVendorField = Object.keys(entry).find(
      (field) => field !== "lastActivity" && field !== "vendor",
    );
    if (unknownVendorField !== undefined)
      return invalidInput([
        {
          code: "unknown_field",
          field: `vendors.${index}.${unknownVendorField}`,
          message: `${unknownVendorField} is not a supported vendor field.`,
        },
      ]);
    if (typeof entry.vendor !== "string" || entry.vendor.trim() === "")
      return invalidInput([
        {
          code: "invalid_vendor_name",
          field: `vendors.${index}.vendor`,
          message: "Each vendor must have a nonempty name.",
        },
      ]);
    if (typeof entry.lastActivity !== "string")
      return invalidInput([
        {
          code: "invalid_last_activity",
          field: `vendors.${index}.lastActivity`,
          message: "Each vendor must have a last-activity date.",
        },
      ]);
    vendors.push({ lastActivity: entry.lastActivity, vendor: entry.vendor });
  }

  try {
    return toolSuccess(
      findDormantVendors({
        asOf: input.asOf,
        dormantDays: input.dormantDays,
        vendors,
      }),
    );
  } catch (error) {
    if (error instanceof SimpleToolError) return simpleFailure(error);
    throw error;
  }
};

export const dormantVendorTool = defineTool<
  DormantVendorInput,
  DormantVendorOutput
>({
  contractVersion: 1,
  description:
    "Flag vendors whose last recorded activity is at least the dormancy threshold before the as-of date.",
  execute: executeDormantVendor,
  execution: { kind: "pure" },
  id: "auditing/dormant-vendor-masterfile-no-activity-period-flag-tester",
  inputSchema: {
    additionalProperties: false,
    properties: {
      asOf: {
        description: "Evaluation date in YYYY-MM-DD format.",
        format: "date",
        type: "string",
      },
      dormantDays: {
        description:
          "Minimum whole days since last activity for a vendor to be dormant.",
        minimum: 1,
        type: "integer",
      },
      vendors: {
        description:
          "Vendor master-file entries with the latest recorded activity date for each vendor.",
        items: {
          additionalProperties: false,
          properties: {
            lastActivity: { format: "date", type: "string" },
            vendor: { minLength: 1, pattern: "\\S", type: "string" },
          },
          required: ["vendor", "lastActivity"],
          type: "object",
        },
        maxItems: toolResourceLimits.generatedValues,
        type: "array",
      },
    },
    required: ["asOf", "dormantDays", "vendors"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      dormantIndices: {
        items: { minimum: 0, type: "integer" },
        type: "array",
      },
      dormantVendors: { minimum: 0, type: "integer" },
      oldestDormantDays: { minimum: 0, type: "integer" },
    },
    required: ["dormantIndices", "dormantVendors", "oldestDormantDays"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "asOf",
        label: "As-of date",
        required: true,
        valueType: { format: "date", type: "string" },
      },
      {
        id: "dormantDays",
        label: "Dormancy threshold",
        required: true,
        valueType: { type: "integer", unit: "day" },
      },
      {
        id: "vendors",
        label: "Vendors",
        required: true,
        valueType: {
          format: "vendor-activity-entry",
          items: { type: "object" },
          type: "list",
        },
      },
    ],
    outputs: [
      {
        id: "dormantIndices",
        label: "Dormant indices",
        valueType: { items: { type: "integer" }, type: "list" },
      },
      {
        id: "dormantVendors",
        label: "Dormant vendors",
        valueType: { type: "integer" },
      },
      {
        description: "Zero when no vendors are dormant.",
        id: "oldestDormantDays",
        label: "Oldest dormant period",
        valueType: { type: "integer", unit: "day" },
      },
    ],
  },
  title: "Dormant Vendor Master File No-Activity Period Flag Tester",
});

export const runDormantVendor = dormantVendorTool.execute;
export default dormantVendorTool;
