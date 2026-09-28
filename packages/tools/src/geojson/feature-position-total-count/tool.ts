import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly featureJson: string };
export type Output = {
  readonly positionCount: number;
  readonly nullGeometry: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { featureJson: { type: "string", maxLength: 8192 } },
  required: ["featureJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positionCount: { type: "integer" },
    nullGeometry: { type: "boolean" },
  },
  required: ["positionCount", "nullGeometry"],
} as const;
/** Count numeric positions in one supplied Feature’s declared geometry structure, including repeated closing positions; not full GeoJSON validation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { featureJson } = request;
  const compute = (): Output => {
    const f = H.plain(H.parseJson(featureJson));
    H.domain(f.type === "Feature");
    if (f.geometry === null) return { positionCount: 0, nullGeometry: true };
    const countGeometry = (value: unknown, depth: number): number => {
      H.domain(depth <= 32);
      const g = H.plain(value),
        kind = H.text(g.type);
      if (kind === "GeometryCollection")
        return H.list(g.geometries).reduce<number>(
          (a, b) => a + countGeometry(b, depth + 1),
          0,
        );
      const dimensions: Readonly<Record<string, number>> = {
        Point: 0,
        MultiPoint: 1,
        LineString: 1,
        MultiLineString: 2,
        Polygon: 2,
        MultiPolygon: 3,
      };
      H.domain(Object.hasOwn(dimensions, kind));
      const countCoordinates = (v: unknown, d: number): number => {
        const a = H.list(v);
        if (d === 0) {
          H.domain(
            a.length >= 2 &&
              a.every((x) => typeof x === "number" && Number.isFinite(x)),
          );
          return 1;
        }
        return a.reduce<number>((n, x) => n + countCoordinates(x, d - 1), 0);
      };
      return countCoordinates(g.coordinates, dimensions[kind]);
    };
    return { positionCount: countGeometry(f.geometry, 0), nullGeometry: false };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    featureJson:
      '{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[0,0],[1,0],[0,1],[0,0]]]},"properties":{}}',
  },
  output: { positionCount: 4, nullGeometry: false },
} satisfies ToolExample<Input, Output>;
export const featurePositionTotalCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/feature-position-total-count",
    title: "Feature Position Total Count Tool",
    description:
      "Count numeric positions in one supplied Feature’s declared geometry structure, including repeated closing positions; not full GeoJSON validation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { featureJson: { type: "string", maxLength: 8192 } },
      required: ["featureJson"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        positionCount: { type: "integer" },
        nullGeometry: { type: "boolean" },
      },
      required: ["positionCount", "nullGeometry"],
    },
    ports: {
      inputs: [
        {
          id: "featureJson",
          label: "Feature Json",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "positionCount",
          label: "Position Count",
          valueType: { type: "integer" },
        },
        {
          id: "nullGeometry",
          label: "Null Geometry",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = featurePositionTotalCountTool.execute;
export default featurePositionTotalCountTool;
