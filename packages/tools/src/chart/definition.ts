import type {
  PresentationWarning,
  TableData,
  TableValueFormat,
} from "../table/definition.js";

export type ChartEncoding = {
  readonly aggregate?:
    "count" | "maximum" | "mean" | "median" | "minimum" | "sum";
  readonly bin?: boolean | number;
  readonly field: string;
  readonly format?: TableValueFormat;
  readonly label?: string;
  readonly scale?: {
    readonly maximum?: number;
    readonly minimum?: number;
    readonly type?: "categorical" | "linear" | "logarithmic" | "temporal";
    readonly zero?: boolean;
  };
};

export type ChartSpec = {
  readonly axes?: Readonly<
    Record<
      "x" | "y",
      {
        readonly grid?: boolean;
        readonly title?: string;
      }
    >
  >;
  readonly encoding: {
    readonly category?: ChartEncoding;
    readonly color?: ChartEncoding;
    readonly series?: ChartEncoding;
    readonly size?: ChartEncoding;
    readonly theta?: ChartEncoding;
    readonly tooltip?: readonly ChartEncoding[];
    readonly x?: ChartEncoding;
    readonly y?: ChartEncoding;
  };
  readonly kind: "tool.io/chart-spec";
  readonly legend?: {
    readonly position?: "bottom" | "left" | "right" | "top";
    readonly title?: string;
    readonly visible?: boolean;
  };
  readonly options?: {
    readonly connectNulls?: boolean;
    readonly missingValues?: "gap" | "omit" | "zero";
    readonly normalized?: boolean;
    readonly orientation?: "horizontal" | "vertical";
    readonly showValues?: boolean;
    readonly stacked?: boolean;
  };
  readonly subtitle?: string;
  readonly summary?: string;
  readonly title?: string;
  readonly type: string;
  readonly version: 1;
};

export type ChartDocument = {
  readonly data: TableData;
  readonly kind: "tool.io/chart-document";
  readonly spec: ChartSpec;
  readonly version: 1;
  readonly warnings: readonly PresentationWarning[];
};

export type ChartValidationIssue = {
  readonly code: string;
  readonly field: string;
  readonly message: string;
};

const numericKinds = new Set(["decimal", "float", "integer"]);
const fieldPattern = /^[A-Za-z][A-Za-z0-9._/-]*$/u;
const chartTypePattern = /^[a-z][a-z0-9-]*$/u;
const aggregates = new Set([
  "count",
  "maximum",
  "mean",
  "median",
  "minimum",
  "sum",
]);
const scaleTypes = new Set([
  "categorical",
  "linear",
  "logarithmic",
  "temporal",
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const hasOnlyKeys = (
  value: Record<string, unknown>,
  keys: readonly string[],
): boolean => Object.keys(value).every((key) => keys.includes(key));

const isFiniteOptional = (value: unknown): boolean =>
  value === undefined || (typeof value === "number" && Number.isFinite(value));

const validFormat = (value: unknown): boolean => {
  if (!isRecord(value) || typeof value.style !== "string") return false;
  if (
    ![
      "currency",
      "date",
      "datetime",
      "duration",
      "integer",
      "number",
      "percent",
      "text",
    ].includes(value.style)
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
    (value.unit === undefined ||
      (typeof value.unit === "string" && value.unit.length > 0)) &&
    hasOnlyKeys(value, [
      "currency",
      "maximumFractionDigits",
      "minimumFractionDigits",
      "style",
      "unit",
    ])
  );
};

const validEncoding = (value: unknown): boolean => {
  if (
    !isRecord(value) ||
    !hasOnlyKeys(value, [
      "aggregate",
      "bin",
      "field",
      "format",
      "label",
      "scale",
    ]) ||
    typeof value.field !== "string" ||
    !fieldPattern.test(value.field)
  )
    return false;
  if (value.aggregate !== undefined && !aggregates.has(String(value.aggregate)))
    return false;
  if (
    value.bin !== undefined &&
    typeof value.bin !== "boolean" &&
    (!Number.isSafeInteger(value.bin) || (value.bin as number) < 1)
  )
    return false;
  if (value.format !== undefined && !validFormat(value.format)) return false;
  if (
    value.label !== undefined &&
    (typeof value.label !== "string" || value.label.length === 0)
  )
    return false;
  if (value.scale !== undefined) {
    if (
      !isRecord(value.scale) ||
      !hasOnlyKeys(value.scale, ["maximum", "minimum", "type", "zero"]) ||
      !isFiniteOptional(value.scale.minimum) ||
      !isFiniteOptional(value.scale.maximum) ||
      (value.scale.type !== undefined &&
        !scaleTypes.has(String(value.scale.type))) ||
      (value.scale.zero !== undefined && typeof value.scale.zero !== "boolean")
    )
      return false;
    if (
      value.scale.minimum !== undefined &&
      value.scale.maximum !== undefined &&
      (value.scale.minimum as number) > (value.scale.maximum as number)
    )
      return false;
    if (
      value.scale.type === "logarithmic" &&
      ((value.scale.minimum !== undefined &&
        (value.scale.minimum as number) <= 0) ||
        (value.scale.maximum !== undefined &&
          (value.scale.maximum as number) <= 0))
    )
      return false;
  }
  return true;
};

const validAxis = (value: unknown): boolean =>
  isRecord(value) &&
  hasOnlyKeys(value, ["grid", "title"]) &&
  (value.grid === undefined || typeof value.grid === "boolean") &&
  (value.title === undefined || typeof value.title === "string");

const validAxes = (value: unknown): boolean =>
  isRecord(value) &&
  hasOnlyKeys(value, ["x", "y"]) &&
  (value.x === undefined || validAxis(value.x)) &&
  (value.y === undefined || validAxis(value.y));

const validLegend = (value: unknown): boolean =>
  isRecord(value) &&
  hasOnlyKeys(value, ["position", "title", "visible"]) &&
  (value.position === undefined ||
    ["bottom", "left", "right", "top"].includes(String(value.position))) &&
  (value.title === undefined || typeof value.title === "string") &&
  (value.visible === undefined || typeof value.visible === "boolean");

const validOptions = (value: unknown): boolean =>
  isRecord(value) &&
  hasOnlyKeys(value, [
    "connectNulls",
    "missingValues",
    "normalized",
    "orientation",
    "showValues",
    "stacked",
  ]) &&
  ["connectNulls", "normalized", "showValues", "stacked"].every(
    (key) => value[key] === undefined || typeof value[key] === "boolean",
  ) &&
  (value.missingValues === undefined ||
    ["gap", "omit", "zero"].includes(String(value.missingValues))) &&
  (value.orientation === undefined ||
    ["horizontal", "vertical"].includes(String(value.orientation)));

export const validateChartSpec = (
  value: unknown,
): readonly ChartValidationIssue[] => {
  if (!isRecord(value))
    return [
      {
        code: "chart_spec_required",
        field: "spec",
        message: "Chart specification must be an object.",
      },
    ];
  const issues: ChartValidationIssue[] = [];
  if (
    !hasOnlyKeys(value, [
      "axes",
      "encoding",
      "kind",
      "legend",
      "options",
      "subtitle",
      "summary",
      "title",
      "type",
      "version",
    ])
  )
    issues.push({
      code: "chart_spec_unknown_property",
      field: "spec",
      message: "Chart specification contains an unknown property.",
    });
  for (const key of ["subtitle", "summary", "title"])
    if (value[key] !== undefined && typeof value[key] !== "string")
      issues.push({
        code: "invalid_chart_text",
        field: `spec.${key}`,
        message: `${key} must be text.`,
      });
  if (value.axes !== undefined && !validAxes(value.axes))
    issues.push({
      code: "invalid_chart_axes",
      field: "spec.axes",
      message: "Chart axes contain unsupported or invalid settings.",
    });
  if (value.legend !== undefined && !validLegend(value.legend))
    issues.push({
      code: "invalid_chart_legend",
      field: "spec.legend",
      message: "Chart legend contains unsupported or invalid settings.",
    });
  if (value.options !== undefined && !validOptions(value.options))
    issues.push({
      code: "invalid_chart_options",
      field: "spec.options",
      message: "Chart options contain unsupported or invalid settings.",
    });
  if (
    value.kind !== "tool.io/chart-spec" ||
    value.version !== 1 ||
    typeof value.type !== "string" ||
    !chartTypePattern.test(value.type)
  )
    issues.push({
      code: "invalid_chart_spec",
      field: "spec",
      message: "Enter a tool.io ChartSpec Version 1 value and chart type.",
    });
  if (!isRecord(value.encoding) || Object.keys(value.encoding).length === 0)
    issues.push({
      code: "chart_encoding_required",
      field: "spec.encoding",
      message: "Chart specification requires at least one encoding.",
    });
  else {
    const allowedChannels = [
      "category",
      "color",
      "series",
      "size",
      "theta",
      "tooltip",
      "x",
      "y",
    ];
    if (!hasOnlyKeys(value.encoding, allowedChannels))
      issues.push({
        code: "chart_channel_invalid",
        field: "spec.encoding",
        message: "Chart specification contains an unknown encoding channel.",
      });
    for (const [channel, encoding] of Object.entries(value.encoding)) {
      const valid =
        channel === "tooltip"
          ? Array.isArray(encoding) && encoding.every(validEncoding)
          : validEncoding(encoding);
      if (!valid)
        issues.push({
          code: "invalid_chart_encoding",
          field: `spec.encoding.${channel}`,
          message: `Chart encoding "${channel}" is invalid.`,
        });
    }
  }
  return issues;
};

export const createChartDocument = (
  data: TableData,
  spec: ChartSpec,
): ChartDocument => {
  const fields = new Map(data.schema.fields.map((field) => [field.id, field]));
  const warnings: PresentationWarning[] = [];
  const encodings = Object.entries(spec.encoding).flatMap(([channel, value]) =>
    Array.isArray(value)
      ? value.map((encoding) => [channel, encoding] as const)
      : value
        ? [[channel, value] as const]
        : [],
  );
  for (const [channel, encoding] of encodings) {
    if (!fields.has(encoding.field))
      warnings.push({
        code: "unknown_field",
        field: encoding.field,
        message: `Chart channel "${channel}" references unknown field "${encoding.field}".`,
      });
  }
  if (spec.type === "bar") {
    if (!spec.encoding.x || !spec.encoding.y)
      warnings.push({
        code: "bar_axes_required",
        message: "A bar chart requires both x and y encodings.",
      });
    const yField = spec.encoding.y && fields.get(spec.encoding.y.field);
    if (yField && !numericKinds.has(yField.dataType.kind))
      warnings.push({
        code: "numeric_y_required",
        field: yField.id,
        message: "A bar chart y field should be numeric.",
      });
  }
  if (["area", "line", "scatter"].includes(spec.type)) {
    if (!spec.encoding.x || !spec.encoding.y)
      warnings.push({
        code: "cartesian_axes_required",
        message: `${spec.type} charts require both x and y encodings.`,
      });
    const yField = spec.encoding.y && fields.get(spec.encoding.y.field);
    if (yField && !numericKinds.has(yField.dataType.kind))
      warnings.push({
        code: "numeric_y_required",
        field: yField.id,
        message: `${spec.type} chart y values should be numeric.`,
      });
    const xField = spec.encoding.x && fields.get(spec.encoding.x.field);
    if (
      spec.type === "scatter" &&
      xField &&
      !numericKinds.has(xField.dataType.kind)
    )
      warnings.push({
        code: "numeric_x_required",
        field: xField.id,
        message: "Scatter-chart x values should be numeric.",
      });
  }
  if (["donut", "pie"].includes(spec.type)) {
    if (!spec.encoding.category || !spec.encoding.theta)
      warnings.push({
        code: "radial_encodings_required",
        message: `${spec.type} charts require category and theta encodings.`,
      });
    const thetaField =
      spec.encoding.theta && fields.get(spec.encoding.theta.field);
    if (thetaField && !numericKinds.has(thetaField.dataType.kind))
      warnings.push({
        code: "numeric_theta_required",
        field: thetaField.id,
        message: `${spec.type} chart theta values should be numeric.`,
      });
  }
  return {
    data,
    kind: "tool.io/chart-document",
    spec,
    version: 1,
    warnings,
  };
};
