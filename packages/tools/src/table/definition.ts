export type TableJsonValue =
  | null
  | boolean
  | number
  | string
  | readonly TableJsonValue[]
  | { readonly [key: string]: TableJsonValue };

export type TableTimeUnit =
  "second" | "millisecond" | "microsecond" | "nanosecond";

export type TableDataType =
  | { readonly kind: "boolean" }
  | {
      readonly bits: 8 | 16 | 32 | 64;
      readonly kind: "integer";
      readonly signed: boolean;
    }
  | { readonly bits: 32 | 64; readonly kind: "float" }
  | {
      readonly kind: "decimal";
      readonly precision: number;
      readonly scale: number;
    }
  | { readonly kind: "string" }
  | { readonly encoding: "base64"; readonly kind: "binary" }
  | { readonly kind: "date" }
  | { readonly kind: "time"; readonly unit: TableTimeUnit }
  | {
      readonly kind: "timestamp";
      readonly timezone?: string;
      readonly unit: TableTimeUnit;
    }
  | {
      readonly kind: "duration";
      readonly unit: TableTimeUnit | "iso8601";
    }
  | { readonly items: TableField; readonly kind: "list" }
  | { readonly fields: readonly TableField[]; readonly kind: "struct" }
  | { readonly kind: "json" };

export type TableField = {
  readonly dataType: TableDataType;
  readonly description?: string;
  readonly id: string;
  readonly label?: string;
  readonly metadata?: Readonly<Record<string, string>>;
  readonly nullable: boolean;
  readonly semanticType?: string;
  readonly unit?: string;
};

export type TableSchema = {
  readonly fields: readonly TableField[];
  readonly metadata?: Readonly<Record<string, string>>;
  readonly primaryKey?: readonly string[];
};

export type TableData = {
  readonly kind: "toolio/table";
  readonly metadata?: Readonly<Record<string, string>>;
  readonly rows: readonly (readonly TableJsonValue[])[];
  readonly schema: TableSchema;
  readonly version: 1;
};

export type TableValueFormat = {
  readonly currency?: string;
  readonly maximumFractionDigits?: number;
  readonly minimumFractionDigits?: number;
  readonly style:
    | "currency"
    | "date"
    | "datetime"
    | "duration"
    | "integer"
    | "number"
    | "percent"
    | "text";
  readonly unit?: string;
};

export type TableSpec = {
  readonly caption?: string;
  readonly columns?: readonly {
    readonly align?: "center" | "left" | "right";
    readonly field: string;
    readonly format?: TableValueFormat;
    readonly label?: string;
    readonly visible?: boolean;
  }[];
  readonly defaultSort?: readonly {
    readonly direction: "ascending" | "descending";
    readonly field: string;
  }[];
  readonly kind: "toolio/table-spec";
  readonly options?: {
    readonly compact?: boolean;
    readonly pageSize?: number;
    readonly showRowNumbers?: boolean;
    readonly stickyHeader?: boolean;
    readonly striped?: boolean;
  };
  readonly title?: string;
  readonly version: 1;
};

export type PresentationWarning = {
  readonly code: string;
  readonly field?: string;
  readonly message: string;
};

export type TableDocument = {
  readonly data: TableData;
  readonly kind: "toolio/table-document";
  readonly spec: TableSpec;
  readonly version: 1;
  readonly warnings: readonly PresentationWarning[];
};

export type TableValidationIssue = {
  readonly code: string;
  readonly field: string;
  readonly message: string;
};

const identifierPattern = /^[A-Za-z][A-Za-z0-9._/-]*$/u;
const integerPattern = /^-?\d+$/u;
const decimalPattern = /^-?(?:0|[1-9]\d*)(?:\.\d+)?$/u;
const datePattern = /^\d{4}-\d{2}-\d{2}$/u;
const timePattern = /^\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/u;
const timestampPattern =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/u;
const durationPattern = /^-?P(?!$).+/u;
const base64Pattern =
  /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isJsonValue = (value: unknown): value is TableJsonValue => {
  if (value === null || typeof value === "boolean" || typeof value === "string")
    return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(isJsonValue);
  return isRecord(value) && Object.values(value).every(isJsonValue);
};

const matchesField = (value: unknown, field: TableField): boolean => {
  if (value === null) return field.nullable;
  const type = field.dataType;
  if (type.kind === "boolean") return typeof value === "boolean";
  if (type.kind === "integer") {
    if (typeof value === "number") return Number.isSafeInteger(value);
    return (
      type.bits === 64 &&
      typeof value === "string" &&
      integerPattern.test(value)
    );
  }
  if (type.kind === "float")
    return typeof value === "number" && Number.isFinite(value);
  if (type.kind === "decimal")
    return typeof value === "string" && decimalPattern.test(value);
  if (type.kind === "string") return typeof value === "string";
  if (type.kind === "binary")
    return typeof value === "string" && base64Pattern.test(value);
  if (type.kind === "date")
    return typeof value === "string" && datePattern.test(value);
  if (type.kind === "time")
    return typeof value === "string" && timePattern.test(value);
  if (type.kind === "timestamp")
    return typeof value === "string" && timestampPattern.test(value);
  if (type.kind === "duration")
    return (
      (type.unit === "iso8601" &&
        typeof value === "string" &&
        durationPattern.test(value)) ||
      (type.unit !== "iso8601" &&
        typeof value === "number" &&
        Number.isFinite(value))
    );
  if (type.kind === "list")
    return (
      Array.isArray(value) &&
      value.every((item) => matchesField(item, type.items))
    );
  if (type.kind === "struct")
    return (
      isRecord(value) &&
      type.fields.every((nested) =>
        Object.hasOwn(value, nested.id)
          ? matchesField(value[nested.id], nested)
          : nested.nullable,
      )
    );
  return isJsonValue(value);
};

export const validateTableData = (
  value: unknown,
): readonly TableValidationIssue[] => {
  const issues: TableValidationIssue[] = [];
  if (!isRecord(value))
    return [
      {
        code: "table_required",
        field: "data",
        message: "Table data must be an object.",
      },
    ];
  if (value.kind !== "toolio/table" || value.version !== 1)
    issues.push({
      code: "unsupported_table",
      field: "data",
      message: "Expected a Tool.io TableData Version 1 value.",
    });
  if (!isRecord(value.schema) || !Array.isArray(value.schema.fields)) {
    issues.push({
      code: "schema_required",
      field: "data.schema",
      message: "Table data requires a field schema.",
    });
    return issues;
  }
  const fields = value.schema.fields as unknown[];
  const typedFields: TableField[] = [];
  const ids = new Set<string>();
  fields.forEach((candidate, index) => {
    if (
      !isRecord(candidate) ||
      typeof candidate.id !== "string" ||
      !identifierPattern.test(candidate.id) ||
      typeof candidate.nullable !== "boolean" ||
      !isRecord(candidate.dataType) ||
      typeof candidate.dataType.kind !== "string"
    ) {
      issues.push({
        code: "invalid_field",
        field: `data.schema.fields.${index}`,
        message:
          "Each table field needs a valid ID, nullability, and data type.",
      });
      return;
    }
    if (ids.has(candidate.id))
      issues.push({
        code: "duplicate_field",
        field: `data.schema.fields.${index}.id`,
        message: `Table field "${candidate.id}" is duplicated.`,
      });
    ids.add(candidate.id);
    typedFields.push(candidate as unknown as TableField);
  });
  if (!Array.isArray(value.rows)) {
    issues.push({
      code: "rows_required",
      field: "data.rows",
      message: "Table data requires an array of rows.",
    });
    return issues;
  }
  value.rows.forEach((row, rowIndex) => {
    if (!Array.isArray(row) || row.length !== typedFields.length) {
      issues.push({
        code: "invalid_row_width",
        field: `data.rows.${rowIndex}`,
        message: `Row ${rowIndex + 1} must contain ${typedFields.length} cells.`,
      });
      return;
    }
    row.forEach((cell, columnIndex) => {
      const field = typedFields[columnIndex];
      if (field && !matchesField(cell, field))
        issues.push({
          code: "invalid_cell",
          field: `data.rows.${rowIndex}.${columnIndex}`,
          message: `Cell does not match field "${field.id}".`,
        });
    });
  });
  return issues;
};

export const createTableDocument = (
  data: TableData,
  spec: Partial<TableSpec> = {},
): TableDocument => {
  const fieldIds = new Set(data.schema.fields.map((field) => field.id));
  const warnings: PresentationWarning[] = [];
  for (const column of spec.columns ?? []) {
    if (!fieldIds.has(column.field))
      warnings.push({
        code: "unknown_field",
        field: column.field,
        message: `Table column "${column.field}" is not present in the data.`,
      });
  }
  return {
    data,
    kind: "toolio/table-document",
    spec: {
      ...spec,
      kind: "toolio/table-spec",
      version: 1,
    },
    version: 1,
    warnings,
  };
};
