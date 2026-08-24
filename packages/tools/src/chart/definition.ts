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
  readonly kind: "toolio/chart-spec";
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
  readonly kind: "toolio/chart-document";
  readonly spec: ChartSpec;
  readonly version: 1;
  readonly warnings: readonly PresentationWarning[];
};

const numericKinds = new Set(["decimal", "float", "integer"]);

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
  return {
    data,
    kind: "toolio/chart-document",
    spec,
    version: 1,
    warnings,
  };
};
