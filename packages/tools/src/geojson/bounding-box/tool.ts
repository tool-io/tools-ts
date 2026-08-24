import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BoundingBoxInput = {
  readonly geojson: Record<string, unknown>;
};

export type BoundingBoxOutput = {
  readonly bbox: readonly number[];
  readonly west: number;
  readonly south: number;
  readonly east: number;
  readonly north: number;
};

export const calculateBoundingBox = (
  input: BoundingBoxInput,
): BoundingBoxOutput => {
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
  let west = positions[0]![0];
  let south = positions[0]![1];
  let east = positions[0]![0];
  let north = positions[0]![1];
  for (const [lng, lat] of positions) {
    if (lng < west) west = lng;
    if (lat < south) south = lat;
    if (lng > east) east = lng;
    if (lat > north) north = lat;
  }
  return { bbox: [west, south, east, north], west, south, east, north };
};

export const boundingBoxExample = {
  input: {
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Point",
            coordinates: [-122.4194, 37.7749],
          },
        },
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-122.5, 37.7],
                [-122.4, 37.7],
                [-122.4, 37.9],
                [-122.5, 37.9],
                [-122.5, 37.7],
              ],
            ],
          },
        },
      ],
    },
  },
  output: {
    bbox: [-122.5, 37.7, -122.4, 37.9],
    west: -122.5,
    south: 37.7,
    east: -122.4,
    north: 37.9,
  },
} satisfies ToolExample<BoundingBoxInput, BoundingBoxOutput>;

export const boundingBoxTool = createSimpleTool({
  id: "geojson/bounding-box",
  title: "GeoJSON Bounding Box",
  description:
    "Compute the [west, south, east, north] bounding box enclosing every position in GeoJSON.",
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
      description: "[west, south, east, north] extents.",
      id: "bbox",
      kind: "numberList",
      label: "Bounding box",
    },
    {
      description: "Minimum longitude.",
      id: "west",
      kind: "number",
      label: "West",
    },
    {
      description: "Minimum latitude.",
      id: "south",
      kind: "number",
      label: "South",
    },
    {
      description: "Maximum longitude.",
      id: "east",
      kind: "number",
      label: "East",
    },
    {
      description: "Maximum latitude.",
      id: "north",
      kind: "number",
      label: "North",
    },
  ],
  calculate: (input) =>
    calculateBoundingBox({
      geojson: input.geojson as Record<string, unknown>,
    }),
});

export const runBoundingBox = boundingBoxTool.execute;
export default boundingBoxTool;
