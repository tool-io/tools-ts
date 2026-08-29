import type { ToolIssue } from "../core/result.js";
import type { TableData, TableField } from "../table/definition.js";
import { validateTableData } from "../table/definition.js";

export const isChartInput = (
  value: unknown,
): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

type FieldRequirement = {
  readonly input: string;
  readonly numeric?: boolean;
  readonly required?: boolean;
};

const numericKinds = new Set(["decimal", "float", "integer"]);

export const specializedChartIssues = (
  input: Record<string, unknown>,
  allowedInputs: readonly string[],
  requirements: readonly FieldRequirement[],
): readonly ToolIssue[] => {
  const issues: ToolIssue[] = Object.keys(input)
    .filter((key) => !allowedInputs.includes(key))
    .map((key) => ({
      code: "unknown_field",
      field: key,
      message: `${key} is not a supported input field.`,
    }));
  issues.push(...validateTableData(input.data));
  for (const requirement of requirements) {
    const value = input[requirement.input];
    if (value === undefined && requirement.required)
      issues.push({
        code: "field_required",
        field: requirement.input,
        message: `Select the ${requirement.input} field.`,
      });
    else if (
      value !== undefined &&
      (typeof value !== "string" || value.length === 0)
    )
      issues.push({
        code: "field_name_invalid",
        field: requirement.input,
        message: `${requirement.input} must be a non-empty field name.`,
      });
  }
  if (issues.length > 0) return issues;

  const fields = new Map(
    (input.data as TableData).schema.fields.map((field) => [field.id, field]),
  );
  for (const requirement of requirements) {
    const id = input[requirement.input];
    if (typeof id !== "string") continue;
    const field = fields.get(id);
    if (!field)
      issues.push({
        code: "unknown_table_field",
        field: requirement.input,
        message: `Field "${id}" is not present in the table schema.`,
      });
    else if (requirement.numeric && !numericKinds.has(field.dataType.kind))
      issues.push({
        code: "numeric_field_required",
        field: requirement.input,
        message: `Field "${id}" must contain numeric values.`,
      });
  }
  return issues;
};

export const optionTypeIssues = (
  input: Record<string, unknown>,
  strings: readonly string[],
  booleans: readonly string[],
  enums: Readonly<Record<string, readonly string[]>> = {},
): readonly ToolIssue[] => {
  const issues: ToolIssue[] = [];
  for (const key of strings)
    if (
      input[key] !== undefined &&
      (typeof input[key] !== "string" || input[key] === "")
    )
      issues.push({
        code: "invalid_option",
        field: key,
        message: `${key} must be a non-empty string.`,
      });
  for (const key of booleans)
    if (input[key] !== undefined && typeof input[key] !== "boolean")
      issues.push({
        code: "invalid_option",
        field: key,
        message: `${key} must be true or false.`,
      });
  for (const [key, values] of Object.entries(enums))
    if (input[key] !== undefined && !values.includes(String(input[key])))
      issues.push({
        code: "invalid_option",
        field: key,
        message: `${key} must be one of: ${values.join(", ")}.`,
      });
  return issues;
};

export const tableField = (
  data: TableData,
  id: string,
): TableField | undefined =>
  data.schema.fields.find((field) => field.id === id);
