import type { ToolExample } from "../core/example.js";
import { defineTool } from "../core/definition.js";
import { invalidInput, toolSuccess } from "../core/result.js";
import type { TableData } from "../table/definition.js";
import { validateTableData } from "../table/definition.js";
import {
  createMapDocument,
  type MapDocument,
  type MapSpec,
} from "./definition.js";

export type MapToolInput = {
  readonly data: TableData;
  readonly spec: MapSpec;
};
export type MapToolOutput = { readonly document: MapDocument };

const exampleData: TableData = {
  kind: "tool.io/table",
  rows: [[28.59, -80.65, "negative"]],
  schema: {
    fields: [
      {
        dataType: { bits: 64, kind: "float" },
        id: "latitude",
        nullable: false,
        semanticType: "latitude",
      },
      {
        dataType: { bits: 64, kind: "float" },
        id: "longitude",
        nullable: false,
        semanticType: "longitude",
      },
      { dataType: { kind: "string" }, id: "polarity", nullable: false },
    ],
  },
  version: 1,
};
const exampleSpec: MapSpec = {
  encoding: {
    color: { field: "polarity" },
    latitude: { field: "latitude" },
    longitude: { field: "longitude" },
  },
  kind: "tool.io/map-spec",
  title: "Lightning observations",
  type: "points",
  version: 1,
};

export const mapExample = {
  input: { data: exampleData, spec: exampleSpec },
  output: { document: createMapDocument(exampleData, exampleSpec) },
} satisfies ToolExample<MapToolInput, MapToolOutput>;

export const mapTool = defineTool<MapToolInput, MapToolOutput>({
  contractVersion: 1,
  description:
    "Create a renderer-independent point-map document from latitude and longitude columns in portable tabular data.",
  discovery: {
    aliases: ["data map", "point map"],
    collections: ["data", "geography"],
    keywords: [
      "coordinates",
      "dataset",
      "geographic",
      "latitude",
      "longitude",
      "map",
    ],
  },
  execution: { kind: "pure" },
  execute: (input) => {
    if (typeof input !== "object" || input === null || Array.isArray(input))
      return invalidInput([
        {
          code: "object_required",
          field: "",
          message: "Input must be an object.",
        },
      ]);
    const candidate = input as Partial<MapToolInput>;
    const issues = validateTableData(candidate.data);
    if (issues.length > 0) return invalidInput(issues);
    if (
      typeof candidate.spec !== "object" ||
      candidate.spec === null ||
      candidate.spec.kind !== "tool.io/map-spec" ||
      candidate.spec.version !== 1 ||
      candidate.spec.type !== "points" ||
      typeof candidate.spec.encoding?.latitude?.field !== "string" ||
      typeof candidate.spec.encoding?.longitude?.field !== "string"
    )
      return invalidInput([
        {
          code: "invalid_map_spec",
          field: "spec",
          message: "Enter a tool.io point MapSpec Version 1 value.",
        },
      ]);
    const mapEncodingValues = Object.values(candidate.spec.encoding).flatMap(
      (encoding) => (Array.isArray(encoding) ? encoding : [encoding]),
    );
    if (
      mapEncodingValues.some(
        (encoding) =>
          typeof encoding !== "object" ||
          encoding === null ||
          typeof (encoding as { field?: unknown }).field !== "string" ||
          (encoding as { field: string }).field.length === 0,
      )
    )
      return invalidInput([
        {
          code: "invalid_map_encoding",
          field: "spec.encoding",
          message: "Every map encoding needs a non-empty field name.",
        },
      ]);
    const mapDocument = createMapDocument(
      candidate.data as TableData,
      candidate.spec as MapSpec,
    );
    if (mapDocument.warnings.length > 0)
      return invalidInput(
        mapDocument.warnings.map((warning) => ({
          code: warning.code,
          field: warning.field ?? "spec.encoding",
          message: warning.message,
        })),
      );
    return toolSuccess({
      document: mapDocument,
    });
  },
  id: "map",
  inputSchema: {
    additionalProperties: false,
    properties: {
      data: { additionalProperties: true, type: "object" },
      spec: { additionalProperties: true, type: "object" },
    },
    required: ["data", "spec"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: { document: { additionalProperties: true, type: "object" } },
    required: ["document"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "data",
        label: "Table data",
        valueType: { format: "tool.io/table", type: "object" },
      },
      {
        id: "spec",
        label: "Map specification",
        valueType: { format: "tool.io/map-spec", type: "object" },
      },
    ],
    outputs: [
      {
        id: "document",
        label: "Map document",
        valueType: { format: "tool.io/map-document", type: "object" },
      },
    ],
  },
  title: "Map",
});

export const runMap = mapTool.execute;
export default mapTool;
