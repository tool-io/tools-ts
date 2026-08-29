export type PortableQuantity = {
  readonly kind: "tool.io/quantity";
  readonly semanticType?: string;
  readonly uncertainty?: number;
  readonly unit: string;
  readonly value: number;
  readonly version: 1;
};

export type PortableDate = {
  readonly calendar: "gregory";
  readonly kind: "tool.io/date";
  readonly value: string;
  readonly version: 1;
};

export type PortableDateTime = {
  readonly kind: "tool.io/date-time";
  readonly timeZone?: string;
  readonly value: string;
  readonly version: 1;
};

export type PortableFileSource =
  | { readonly data: string; readonly kind: "base64" }
  | { readonly kind: "uri"; readonly uri: string };

export type PortableFile = {
  readonly kind: "tool.io/file";
  readonly mediaType: string;
  readonly name: string;
  readonly sha256?: string;
  readonly sizeBytes: number;
  readonly source: PortableFileSource;
  readonly version: 1;
};

export type PortableDocumentContent =
  | { readonly kind: "file"; readonly file: PortableFile }
  | { readonly kind: "text"; readonly text: string };

export type PortableDocument = {
  readonly content: PortableDocumentContent;
  readonly kind: "tool.io/document";
  readonly language?: string;
  readonly mediaType: string;
  readonly title?: string;
  readonly version: 1;
};

export type PortableStructuredValue =
  | PortableDate
  | PortableDateTime
  | PortableDocument
  | PortableFile
  | PortableQuantity;

export type PortableValueValidationIssue = {
  readonly code: string;
  readonly field: string;
  readonly message: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const issue = (
  code: string,
  field: string,
  message: string,
): PortableValueValidationIssue => ({ code, field, message });

const unknownPropertyIssues = (
  value: Record<string, unknown>,
  allowed: ReadonlySet<string>,
  field: string,
): readonly PortableValueValidationIssue[] =>
  Object.keys(value)
    .filter((key) => !allowed.has(key))
    .map((key) =>
      issue(
        "unknown_property",
        field ? `${field}.${key}` : key,
        `Property "${key}" is not part of this portable value.`,
      ),
    );

const nonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim() !== "";

const datePattern = /^(\d{4})-(\d{2})-(\d{2})$/u;
const dateTimePattern =
  /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/u;
const base64Pattern =
  /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u;
const sha256Pattern = /^[0-9a-f]{64}$/u;
const uriPattern = /^[A-Za-z][A-Za-z0-9+.-]*:[^\s]+$/u;
const languagePattern = /^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$/u;
const mediaTypePattern =
  /^[A-Za-z0-9!#$&^_.+-]+\/[A-Za-z0-9!#$&^_.+-]+(?:\s*;\s*[A-Za-z0-9!#$&^_.+-]+=(?:"[^"\r\n]*"|[A-Za-z0-9!#$&^_.+-]+))*$/u;

const isLeapYear = (year: number): boolean =>
  year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

const isCalendarDate = (value: unknown): value is string => {
  if (typeof value !== "string") return false;
  const match = datePattern.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12) return false;
  const days = [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  return day >= 1 && day <= (days[month - 1] ?? 0);
};

const isDateTime = (value: unknown): value is string => {
  if (typeof value !== "string") return false;
  const match = dateTimePattern.exec(value);
  if (!match || !isCalendarDate(match[1])) return false;
  return (
    Number(match[2]) <= 23 && Number(match[3]) <= 59 && Number(match[4]) <= 59
  );
};

const isMediaType = (value: unknown): value is string =>
  typeof value === "string" && mediaTypePattern.test(value);

const base64ByteLength = (value: string): number =>
  (value.length / 4) * 3 -
  (value.endsWith("==") ? 2 : value.endsWith("=") ? 1 : 0);

export const validatePortableQuantity = (
  value: unknown,
): readonly PortableValueValidationIssue[] => {
  if (!isRecord(value))
    return [issue("quantity_required", "", "Quantity must be an object.")];
  const issues = [
    ...unknownPropertyIssues(
      value,
      new Set([
        "kind",
        "semanticType",
        "uncertainty",
        "unit",
        "value",
        "version",
      ]),
      "",
    ),
  ];
  if (value.kind !== "tool.io/quantity" || value.version !== 1)
    issues.push(
      issue(
        "quantity_version_invalid",
        "",
        "Expected a tool.io Quantity Version 1 value.",
      ),
    );
  if (typeof value.value !== "number" || !Number.isFinite(value.value))
    issues.push(
      issue("quantity_value_invalid", "value", "Value must be finite."),
    );
  if (!nonEmptyString(value.unit))
    issues.push(issue("quantity_unit_invalid", "unit", "Unit is required."));
  if (value.semanticType !== undefined && !nonEmptyString(value.semanticType))
    issues.push(
      issue(
        "quantity_semantic_type_invalid",
        "semanticType",
        "Semantic type must be non-empty when supplied.",
      ),
    );
  if (
    value.uncertainty !== undefined &&
    (typeof value.uncertainty !== "number" ||
      !Number.isFinite(value.uncertainty) ||
      value.uncertainty < 0)
  )
    issues.push(
      issue(
        "quantity_uncertainty_invalid",
        "uncertainty",
        "Uncertainty must be a finite nonnegative number.",
      ),
    );
  return issues;
};

export const validatePortableDate = (
  value: unknown,
): readonly PortableValueValidationIssue[] => {
  if (!isRecord(value))
    return [issue("date_required", "", "Date must be an object.")];
  const issues = [
    ...unknownPropertyIssues(
      value,
      new Set(["calendar", "kind", "value", "version"]),
      "",
    ),
  ];
  if (
    value.kind !== "tool.io/date" ||
    value.version !== 1 ||
    value.calendar !== "gregory"
  )
    issues.push(
      issue(
        "date_version_invalid",
        "",
        "Expected a tool.io Gregorian Date Version 1 value.",
      ),
    );
  if (!isCalendarDate(value.value))
    issues.push(
      issue(
        "date_value_invalid",
        "value",
        "Date must be a real Gregorian date in YYYY-MM-DD form.",
      ),
    );
  return issues;
};

export const validatePortableDateTime = (
  value: unknown,
): readonly PortableValueValidationIssue[] => {
  if (!isRecord(value))
    return [issue("date_time_required", "", "Date-time must be an object.")];
  const issues = [
    ...unknownPropertyIssues(
      value,
      new Set(["kind", "timeZone", "value", "version"]),
      "",
    ),
  ];
  if (value.kind !== "tool.io/date-time" || value.version !== 1)
    issues.push(
      issue(
        "date_time_version_invalid",
        "",
        "Expected a tool.io Date-Time Version 1 value.",
      ),
    );
  if (!isDateTime(value.value))
    issues.push(
      issue(
        "date_time_value_invalid",
        "value",
        "Date-time must use RFC 3339 form with an explicit UTC offset.",
      ),
    );
  if (value.timeZone !== undefined && !nonEmptyString(value.timeZone))
    issues.push(
      issue(
        "date_time_zone_invalid",
        "timeZone",
        "Time zone must be non-empty when supplied.",
      ),
    );
  return issues;
};

const validateFileSource = (
  value: unknown,
): readonly PortableValueValidationIssue[] => {
  if (!isRecord(value))
    return [issue("file_source_required", "source", "Source is required.")];
  if (value.kind === "base64") {
    const issues = unknownPropertyIssues(
      value,
      new Set(["data", "kind"]),
      "source",
    );
    return typeof value.data === "string" && base64Pattern.test(value.data)
      ? issues
      : [
          ...issues,
          issue(
            "file_base64_invalid",
            "source.data",
            "Embedded file data must be canonical Base64.",
          ),
        ];
  }
  if (value.kind === "uri") {
    const issues = unknownPropertyIssues(
      value,
      new Set(["kind", "uri"]),
      "source",
    );
    return typeof value.uri === "string" && uriPattern.test(value.uri)
      ? issues
      : [
          ...issues,
          issue(
            "file_uri_invalid",
            "source.uri",
            "File URI must be an absolute URI without whitespace.",
          ),
        ];
  }
  return [
    issue(
      "file_source_kind_invalid",
      "source.kind",
      'File source kind must be "base64" or "uri".',
    ),
  ];
};

export const validatePortableFile = (
  value: unknown,
): readonly PortableValueValidationIssue[] => {
  if (!isRecord(value))
    return [issue("file_required", "", "File must be an object.")];
  const issues = [
    ...unknownPropertyIssues(
      value,
      new Set([
        "kind",
        "mediaType",
        "name",
        "sha256",
        "sizeBytes",
        "source",
        "version",
      ]),
      "",
    ),
  ];
  if (value.kind !== "tool.io/file" || value.version !== 1)
    issues.push(
      issue(
        "file_version_invalid",
        "",
        "Expected a tool.io File Version 1 value.",
      ),
    );
  if (!nonEmptyString(value.name) || value.name.includes("\0"))
    issues.push(
      issue("file_name_invalid", "name", "File name must be non-empty."),
    );
  if (!isMediaType(value.mediaType))
    issues.push(
      issue(
        "file_media_type_invalid",
        "mediaType",
        "File media type must be a valid MIME media type.",
      ),
    );
  if (!Number.isSafeInteger(value.sizeBytes) || (value.sizeBytes as number) < 0)
    issues.push(
      issue(
        "file_size_invalid",
        "sizeBytes",
        "File size must be a nonnegative safe integer.",
      ),
    );
  if (
    value.sha256 !== undefined &&
    (typeof value.sha256 !== "string" || !sha256Pattern.test(value.sha256))
  )
    issues.push(
      issue(
        "file_sha256_invalid",
        "sha256",
        "SHA-256 must contain 64 lowercase hexadecimal characters.",
      ),
    );
  issues.push(...validateFileSource(value.source));
  if (
    isRecord(value.source) &&
    value.source.kind === "base64" &&
    typeof value.source.data === "string" &&
    base64Pattern.test(value.source.data) &&
    Number.isSafeInteger(value.sizeBytes) &&
    value.sizeBytes !== base64ByteLength(value.source.data)
  )
    issues.push(
      issue(
        "file_size_mismatch",
        "sizeBytes",
        "File size does not match the embedded Base64 data.",
      ),
    );
  return issues;
};

export const validatePortableDocument = (
  value: unknown,
): readonly PortableValueValidationIssue[] => {
  if (!isRecord(value))
    return [issue("document_required", "", "Document must be an object.")];
  const issues = [
    ...unknownPropertyIssues(
      value,
      new Set(["content", "kind", "language", "mediaType", "title", "version"]),
      "",
    ),
  ];
  if (value.kind !== "tool.io/document" || value.version !== 1)
    issues.push(
      issue(
        "document_version_invalid",
        "",
        "Expected a tool.io Document Version 1 value.",
      ),
    );
  if (!isMediaType(value.mediaType))
    issues.push(
      issue(
        "document_media_type_invalid",
        "mediaType",
        "Document media type must be a valid MIME media type.",
      ),
    );
  if (value.title !== undefined && !nonEmptyString(value.title))
    issues.push(
      issue(
        "document_title_invalid",
        "title",
        "Document title must be non-empty when supplied.",
      ),
    );
  if (
    value.language !== undefined &&
    (typeof value.language !== "string" ||
      !languagePattern.test(value.language))
  )
    issues.push(
      issue(
        "document_language_invalid",
        "language",
        "Document language must be a valid language tag.",
      ),
    );
  if (!isRecord(value.content))
    issues.push(
      issue(
        "document_content_required",
        "content",
        "Document content is required.",
      ),
    );
  else if (value.content.kind === "text") {
    issues.push(
      ...unknownPropertyIssues(
        value.content,
        new Set(["kind", "text"]),
        "content",
      ),
    );
    if (typeof value.content.text !== "string")
      issues.push(
        issue(
          "document_text_invalid",
          "content.text",
          "Text document content must be a string.",
        ),
      );
  } else if (value.content.kind === "file") {
    issues.push(
      ...unknownPropertyIssues(
        value.content,
        new Set(["file", "kind"]),
        "content",
      ),
      ...validatePortableFile(value.content.file).map((entry) => ({
        ...entry,
        field: entry.field ? `content.file.${entry.field}` : "content.file",
      })),
    );
  } else
    issues.push(
      issue(
        "document_content_kind_invalid",
        "content.kind",
        'Document content kind must be "text" or "file".',
      ),
    );
  return issues;
};

export const validatePortableStructuredValue = (
  value: unknown,
): readonly PortableValueValidationIssue[] => {
  if (!isRecord(value))
    return [
      issue(
        "portable_value_required",
        "",
        "Portable structured value must be an object.",
      ),
    ];
  if (value.kind === "tool.io/quantity") return validatePortableQuantity(value);
  if (value.kind === "tool.io/date") return validatePortableDate(value);
  if (value.kind === "tool.io/date-time")
    return validatePortableDateTime(value);
  if (value.kind === "tool.io/file") return validatePortableFile(value);
  if (value.kind === "tool.io/document") return validatePortableDocument(value);
  return [
    issue(
      "portable_value_kind_invalid",
      "kind",
      "Portable structured value kind is not supported.",
    ),
  ];
};
