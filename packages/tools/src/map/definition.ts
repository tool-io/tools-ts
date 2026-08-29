import type {
  PresentationWarning,
  TableData,
  TableValueFormat,
} from "../table/definition.js";

export type MapEncoding = {
  readonly field: string;
  readonly format?: TableValueFormat;
  readonly label?: string;
};

export type MapSpec = {
  readonly encoding: {
    readonly color?: MapEncoding;
    readonly label?: MapEncoding;
    readonly latitude: MapEncoding;
    readonly longitude: MapEncoding;
    readonly size?: MapEncoding;
    readonly tooltip?: readonly MapEncoding[];
  };
  readonly kind: "tool.io/map-spec";
  readonly legend?: {
    readonly position?: "bottom" | "left" | "right" | "top";
    readonly title?: string;
    readonly visible?: boolean;
  };
  readonly options?: {
    readonly basemap?: "light" | "streets" | "terrain";
    readonly cluster?: boolean;
    readonly fit?: "data" | "fixed";
    readonly padding?: number;
  };
  readonly summary?: string;
  readonly title?: string;
  readonly type: "points";
  readonly version: 1;
  readonly view?: {
    readonly center?: readonly [longitude: number, latitude: number];
    readonly maximumZoom?: number;
    readonly minimumZoom?: number;
    readonly zoom?: number;
  };
};

export type MapDocument = {
  readonly data: TableData;
  readonly kind: "tool.io/map-document";
  readonly spec: MapSpec;
  readonly version: 1;
  readonly warnings: readonly PresentationWarning[];
};

const numericKinds = new Set(["decimal", "float", "integer"]);

export const createMapDocument = (
  data: TableData,
  spec: MapSpec,
): MapDocument => {
  const fields = new Map(data.schema.fields.map((field) => [field.id, field]));
  const warnings: PresentationWarning[] = [];
  for (const [channel, encoding] of Object.entries(spec.encoding)) {
    const values = Array.isArray(encoding) ? encoding : [encoding];
    for (const value of values) {
      if (!fields.has(value.field))
        warnings.push({
          code: "unknown_field",
          field: value.field,
          message: `Map channel "${channel}" references unknown field "${value.field}".`,
        });
    }
  }
  for (const channel of ["latitude", "longitude"] as const) {
    const field = fields.get(spec.encoding[channel].field);
    if (field && !numericKinds.has(field.dataType.kind))
      warnings.push({
        code: "numeric_coordinate_required",
        field: field.id,
        message: `Map ${channel} values must use a numeric field.`,
      });
  }
  return {
    data,
    kind: "tool.io/map-document",
    spec,
    version: 1,
    warnings,
  };
};
