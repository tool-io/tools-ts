import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CentroidInput = {
  readonly geojson: Record<string, unknown>;
};

export type CentroidOutput = {
  readonly longitude: number;
  readonly latitude: number;
};

export const calculateCentroid = (input: CentroidInput): CentroidOutput => {
  const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);
  const GEOMETRY_TYPES = new Set([
    "Point",
    "MultiPoint",
    "LineString",
    "MultiLineString",
    "Polygon",
    "MultiPolygon",
  ]);
  const positions: number[][] = [];
  const collect = (node: unknown): void => {
    if (!Array.isArray(node)) return;
    if (typeof node[0] === "number") {
      if (
        node.length < 2 ||
        !node.every(
          (value) => typeof value === "number" && Number.isFinite(value),
        ) ||
        (node[0] as number) < -180 ||
        (node[0] as number) > 180 ||
        (node[1] as number) < -90 ||
        (node[1] as number) > 90
      )
        simpleError(
          "geojson",
          "Every position must contain finite longitude and latitude values in range.",
          "invalid_position",
        );
      positions.push(node as number[]);
      return;
    }
    for (const child of node) collect(child);
  };
  const pending: unknown[] = [input.geojson];
  while (pending.length > 0) {
    const node = pending.pop();
    if (!isRecord(node))
      simpleError("geojson", "GeoJSON must be an object.", "invalid_geojson");
    const source = node as Record<string, unknown>;
    if (source.type === "FeatureCollection") {
      pending.push(...(Array.isArray(source.features) ? source.features : []));
    } else if (source.type === "Feature") {
      pending.push(source.geometry);
    } else if (source.type === "GeometryCollection") {
      pending.push(
        ...(Array.isArray(source.geometries) ? source.geometries : []),
      );
    } else if (GEOMETRY_TYPES.has(String(source.type))) {
      collect(source.coordinates);
    } else {
      simpleError(
        "geojson",
        "Unsupported GeoJSON object type.",
        "unsupported_type",
      );
    }
  }
  if (positions.length === 0)
    simpleError(
      "geojson",
      "No coordinates found in the provided GeoJSON.",
      "not_found",
    );
  let longitudeSum = 0;
  let latitudeSum = 0;
  for (const [lng, lat] of positions) {
    longitudeSum += lng;
    latitudeSum += lat;
  }
  return {
    longitude: longitudeSum / positions.length,
    latitude: latitudeSum / positions.length,
  };
};

export const centroidExample = {
  input: {
    geojson: {
      type: "GeometryCollection",
      geometries: [
        {
          type: "Point",
          coordinates: [0, 0],
        },
        {
          type: "Point",
          coordinates: [10, 20],
        },
      ],
    },
  },
  output: {
    longitude: 5,
    latitude: 10,
  },
} satisfies ToolExample<CentroidInput, CentroidOutput>;

export const centroidTool = createSimpleTool({
  id: "geojson/centroid",
  title: "GeoJSON Centroid",
  description:
    "Compute the arithmetic mean (vertex centroid) of every position contained in GeoJSON.",
  inputs: [
    {
      description: "GeoJSON geometry, feature or collection.",
      id: "geojson",
      kind: "object",
      label: "GeoJSON",
    },
  ],
  outputs: [
    {
      description: "Mean longitude of all vertices.",
      id: "longitude",
      kind: "number",
      label: "Longitude",
    },
    {
      description: "Mean latitude of all vertices.",
      id: "latitude",
      kind: "number",
      label: "Latitude",
    },
  ],
  calculate: (input) =>
    calculateCentroid({
      geojson: input.geojson as Record<string, unknown>,
    }),
});

export const runCentroid = centroidTool.execute;
export default centroidTool;
