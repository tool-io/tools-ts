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
  readonly kind: "tool.io/table";
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
  readonly kind: "tool.io/table-spec";
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
  readonly kind: "tool.io/table-document";
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

const hasOnlyKeys = (
  value: Record<string, unknown>,
  keys: readonly string[],
): boolean => Object.keys(value).every((key) => keys.includes(key));

const isMetadata = (
  value: unknown,
): value is Readonly<Record<string, string>> =>
  isRecord(value) &&
  Object.entries(value).every(
    ([key, entry]) => key.length > 0 && typeof entry === "string",
  );

const isCalendarDate = (value: string): boolean => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return month >= 1 && month <= 12 && day >= 1 && day <= (days[month - 1] ?? 0);
};

const isClockTime = (value: string): boolean => {
  const match =
    /^(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/u.exec(value);
  return (
    match !== null &&
    Number(match[1]) <= 23 &&
    Number(match[2]) <= 59 &&
    Number(match[3]) <= 59
  );
};

const isTimestamp = (value: string): boolean => {
  const separator = value.indexOf("T");
  return (
    separator === 10 &&
    isCalendarDate(value.slice(0, separator)) &&
    isClockTime(value.slice(separator + 1)) &&
    timestampPattern.test(value)
  );
};

const integerBounds = (
  bits: 8 | 16 | 32 | 64,
  signed: boolean,
): readonly [minimum: bigint, maximum: bigint] => {
  const width = BigInt(bits);
  return signed
    ? [-(2n ** (width - 1n)), 2n ** (width - 1n) - 1n]
    : [0n, 2n ** width - 1n];
};

const timeUnits = new Set([
  "second",
  "millisecond",
  "microsecond",
  "nanosecond",
]);

function isTableField(value: unknown): value is TableField {
  return (
    isRecord(value) &&
    hasOnlyKeys(value, [
      "dataType",
      "description",
      "id",
      "label",
      "metadata",
      "nullable",
      "semanticType",
      "unit",
    ]) &&
    typeof value.id === "string" &&
    identifierPattern.test(value.id) &&
    typeof value.nullable === "boolean" &&
    (value.description === undefined ||
      typeof value.description === "string") &&
    (value.label === undefined ||
      (typeof value.label === "string" && value.label.length > 0)) &&
    (value.metadata === undefined || isMetadata(value.metadata)) &&
    (value.semanticType === undefined ||
      (typeof value.semanticType === "string" &&
        value.semanticType.length > 0)) &&
    (value.unit === undefined ||
      (typeof value.unit === "string" && value.unit.length > 0)) &&
    isTableDataType(value.dataType)
  );
}

function isTableDataType(value: unknown): value is TableDataType {
  if (!isRecord(value) || typeof value.kind !== "string") return false;
  if (["boolean", "string", "date", "json"].includes(value.kind))
    return hasOnlyKeys(value, ["kind"]);
  if (value.kind === "integer")
    return (
      hasOnlyKeys(value, ["bits", "kind", "signed"]) &&
      [8, 16, 32, 64].includes(value.bits as number) &&
      typeof value.signed === "boolean"
    );
  if (value.kind === "float")
    return (
      hasOnlyKeys(value, ["bits", "kind"]) &&
      (value.bits === 32 || value.bits === 64)
    );
  if (value.kind === "decimal")
    return (
      hasOnlyKeys(value, ["kind", "precision", "scale"]) &&
      Number.isInteger(value.precision) &&
      Number.isInteger(value.scale) &&
      (value.precision as number) > 0 &&
      (value.scale as number) >= 0 &&
      (value.scale as number) <= (value.precision as number)
    );
  if (value.kind === "binary")
    return (
      hasOnlyKeys(value, ["encoding", "kind"]) && value.encoding === "base64"
    );
  if (value.kind === "time")
    return (
      hasOnlyKeys(value, ["kind", "unit"]) &&
      timeUnits.has(value.unit as string)
    );
  if (value.kind === "timestamp")
    return (
      hasOnlyKeys(value, ["kind", "timezone", "unit"]) &&
      timeUnits.has(value.unit as string) &&
      (value.timezone === undefined ||
        (typeof value.timezone === "string" && value.timezone.length > 0))
    );
  if (value.kind === "duration")
    return (
      hasOnlyKeys(value, ["kind", "unit"]) &&
      (value.unit === "iso8601" || timeUnits.has(value.unit as string))
    );
  if (value.kind === "list")
    return hasOnlyKeys(value, ["items", "kind"]) && isTableField(value.items);
  if (value.kind === "struct")
    return (
      hasOnlyKeys(value, ["fields", "kind"]) &&
      Array.isArray(value.fields) &&
      value.fields.every(isTableField) &&
      new Set(value.fields.map((field) => field.id)).size ===
        value.fields.length
    );
  return false;
}

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
    if (
      (typeof value !== "number" || !Number.isSafeInteger(value)) &&
      !(
        type.bits === 64 &&
        typeof value === "string" &&
        integerPattern.test(value)
      )
    )
      return false;
    const integer = BigInt(value);
    const [minimum, maximum] = integerBounds(type.bits, type.signed);
    return integer >= minimum && integer <= maximum;
  }
  if (type.kind === "float")
    return typeof value === "number" && Number.isFinite(value);
  if (type.kind === "decimal")
    if (typeof value !== "string" || !decimalPattern.test(value)) return false;
    else {
      const unsigned = value.startsWith("-") ? value.slice(1) : value;
      const [integer = "", fraction = ""] = unsigned.split(".");
      return (
        integer.length + fraction.length <= type.precision &&
        fraction.length <= type.scale
      );
    }
  if (type.kind === "string") return typeof value === "string";
  if (type.kind === "binary")
    return typeof value === "string" && base64Pattern.test(value);
  if (type.kind === "date")
    return (
      typeof value === "string" &&
      datePattern.test(value) &&
      isCalendarDate(value)
    );
  if (type.kind === "time")
    return (
      typeof value === "string" && timePattern.test(value) && isClockTime(value)
    );
  if (type.kind === "timestamp")
    return typeof value === "string" && isTimestamp(value);
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
      Object.keys(value).every((key) =>
        type.fields.some((nested) => nested.id === key),
      ) &&
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
  for (const key of Object.keys(value))
    if (!["kind", "metadata", "rows", "schema", "version"].includes(key))
      issues.push({
        code: "unknown_table_property",
        field: `data.${key}`,
        message: `Property "${key}" is not part of TableData Version 1.`,
      });
  if (value.kind !== "tool.io/table" || value.version !== 1)
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
  if (value.metadata !== undefined && !isMetadata(value.metadata))
    issues.push({
      code: "invalid_metadata",
      field: "data.metadata",
      message: "Table metadata values must be strings with non-empty keys.",
    });
  for (const key of Object.keys(value.schema))
    if (!["fields", "metadata", "primaryKey"].includes(key))
      issues.push({
        code: "unknown_schema_property",
        field: `data.schema.${key}`,
        message: `Property "${key}" is not part of TableSchema Version 1.`,
      });
  if (value.schema.metadata !== undefined && !isMetadata(value.schema.metadata))
    issues.push({
      code: "invalid_metadata",
      field: "data.schema.metadata",
      message: "Schema metadata values must be strings with non-empty keys.",
    });
  const fields = value.schema.fields as unknown[];
  const typedFields: TableField[] = [];
  const ids = new Set<string>();
  fields.forEach((candidate, index) => {
    if (
      !isRecord(candidate) ||
      typeof candidate.id !== "string" ||
      !identifierPattern.test(candidate.id) ||
      typeof candidate.nullable !== "boolean" ||
      !isTableDataType(candidate.dataType)
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
  if (value.schema.primaryKey !== undefined) {
    if (
      !Array.isArray(value.schema.primaryKey) ||
      value.schema.primaryKey.length === 0 ||
      value.schema.primaryKey.some(
        (key) => typeof key !== "string" || !ids.has(key),
      ) ||
      new Set(value.schema.primaryKey).size !== value.schema.primaryKey.length
    )
      issues.push({
        code: "invalid_primary_key",
        field: "data.schema.primaryKey",
        message:
          "Primary key must contain unique IDs of fields in the table schema.",
      });
  }
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

const validValueFormat = (value: unknown): boolean => {
  if (
    !isRecord(value) ||
    !hasOnlyKeys(value, [
      "currency",
      "maximumFractionDigits",
      "minimumFractionDigits",
      "style",
      "unit",
    ]) ||
    ![
      "currency",
      "date",
      "datetime",
      "duration",
      "integer",
      "number",
      "percent",
      "text",
    ].includes(String(value.style))
  )
    return false;
  if (
    value.currency !== undefined &&
    (typeof value.currency !== "string" || !/^[A-Z]{3}$/u.test(value.currency))
  )
    return false;
  for (const key of ["minimumFractionDigits", "maximumFractionDigits"])
    if (
      value[key] !== undefined &&
      (!Number.isSafeInteger(value[key]) ||
        (value[key] as number) < 0 ||
        (value[key] as number) > 20)
    )
      return false;
  return (
    value.unit === undefined ||
    (typeof value.unit === "string" && value.unit.length > 0)
  );
};

export const validateTableSpec = (
  value: unknown,
  partial = false,
): readonly TableValidationIssue[] => {
  if (!isRecord(value))
    return [
      {
        code: "table_spec_required",
        field: "spec",
        message: "Table specification must be an object.",
      },
    ];
  const issues: TableValidationIssue[] = [];
  if (
    !hasOnlyKeys(value, [
      "caption",
      "columns",
      "defaultSort",
      "kind",
      "options",
      "title",
      "version",
    ])
  )
    issues.push({
      code: "table_spec_unknown_property",
      field: "spec",
      message: "Table specification contains an unknown property.",
    });
  if (
    (!partial || value.kind !== undefined) &&
    value.kind !== "tool.io/table-spec"
  )
    issues.push({
      code: "table_spec_kind_invalid",
      field: "spec.kind",
      message: 'Table specification kind must be "tool.io/table-spec".',
    });
  if ((!partial || value.version !== undefined) && value.version !== 1)
    issues.push({
      code: "table_spec_version_invalid",
      field: "spec.version",
      message: "Table specification version must be 1.",
    });
  for (const key of ["caption", "title"])
    if (value[key] !== undefined && typeof value[key] !== "string")
      issues.push({
        code: "table_spec_text_invalid",
        field: `spec.${key}`,
        message: `${key} must be text when supplied.`,
      });
  if (value.columns !== undefined) {
    if (!Array.isArray(value.columns))
      issues.push({
        code: "invalid_table_columns",
        field: "spec.columns",
        message: "Table columns must be an array.",
      });
    else
      value.columns.forEach((column, index) => {
        if (
          !isRecord(column) ||
          !hasOnlyKeys(column, [
            "align",
            "field",
            "format",
            "label",
            "visible",
          ]) ||
          typeof column.field !== "string" ||
          !identifierPattern.test(column.field) ||
          (column.align !== undefined &&
            !["center", "left", "right"].includes(String(column.align))) ||
          (column.format !== undefined && !validValueFormat(column.format)) ||
          (column.label !== undefined &&
            (typeof column.label !== "string" || column.label.length === 0)) ||
          (column.visible !== undefined && typeof column.visible !== "boolean")
        )
          issues.push({
            code: "invalid_table_column",
            field: `spec.columns.${index}`,
            message: "Table column is invalid.",
          });
      });
  }
  if (value.defaultSort !== undefined) {
    if (!Array.isArray(value.defaultSort))
      issues.push({
        code: "invalid_table_sort",
        field: "spec.defaultSort",
        message: "Default sort must be an array.",
      });
    else {
      const fields = new Set<string>();
      value.defaultSort.forEach((sort, index) => {
        if (
          !isRecord(sort) ||
          !hasOnlyKeys(sort, ["direction", "field"]) ||
          typeof sort.field !== "string" ||
          !identifierPattern.test(sort.field) ||
          !["ascending", "descending"].includes(String(sort.direction)) ||
          fields.has(String(sort.field))
        )
          issues.push({
            code: "invalid_table_sort",
            field: `spec.defaultSort.${index}`,
            message:
              "Each default sort needs a unique field and valid direction.",
          });
        fields.add(String(sort.field));
      });
    }
  }
  if (value.options !== undefined) {
    const options = value.options;
    if (!isRecord(options))
      issues.push({
        code: "invalid_table_options",
        field: "spec.options",
        message: "Table options are invalid.",
      });
    else if (
      !hasOnlyKeys(options, [
        "compact",
        "pageSize",
        "showRowNumbers",
        "stickyHeader",
        "striped",
      ]) ||
      ["compact", "showRowNumbers", "stickyHeader", "striped"].some(
        (key) =>
          options[key] !== undefined && typeof options[key] !== "boolean",
      ) ||
      (options.pageSize !== undefined &&
        (!Number.isSafeInteger(options.pageSize) ||
          (options.pageSize as number) < 1))
    )
      issues.push({
        code: "invalid_table_options",
        field: "spec.options",
        message: "Table options are invalid.",
      });
  }
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
  for (const sort of spec.defaultSort ?? []) {
    if (!fieldIds.has(sort.field))
      warnings.push({
        code: "unknown_sort_field",
        field: sort.field,
        message: `Default sort field "${sort.field}" is not present in the data.`,
      });
  }
  return {
    data,
    kind: "tool.io/table-document",
    spec: {
      ...spec,
      kind: "tool.io/table-spec",
      version: 1,
    },
    version: 1,
    warnings,
  };
};
