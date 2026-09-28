import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly memberTypes: readonly string[];
  readonly emptyMembers: readonly boolean[];
};
export type Output = {
  readonly emptyIndices: readonly number[];
  readonly collectionEmpty: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    memberTypes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    emptyMembers: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["memberTypes", "emptyMembers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    emptyIndices: { type: "array", maxItems: 256, items: { type: "integer" } },
    collectionEmpty: { type: "boolean" },
  },
  required: ["emptyIndices", "collectionEmpty"],
} as const;
/** Distinguish an empty collection from supplied member geometries flagged empty. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { memberTypes, emptyMembers } = request;
  const compute = (): Output => {
    H.sameLength(memberTypes, emptyMembers);
    H.domain(
      memberTypes.every((x) =>
        [
          "Point",
          "MultiPoint",
          "LineString",
          "MultiLineString",
          "Polygon",
          "MultiPolygon",
          "GeometryCollection",
        ].includes(x),
      ),
    );
    return {
      emptyIndices: emptyMembers.flatMap((x, i) => (x ? [i] : [])),
      collectionEmpty: memberTypes.length === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { memberTypes: ["Point", "LineString"], emptyMembers: [false, true] },
  output: { emptyIndices: [1], collectionEmpty: false },
} satisfies ToolExample<Input, Output>;
export const geometryCollectionEmptyMemberRoleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/geometry-collection-empty-member-role",
    title: "Geometry Collection Empty Member Role Tool",
    description:
      "Distinguish an empty collection from supplied member geometries flagged empty.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        memberTypes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        emptyMembers: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["memberTypes", "emptyMembers"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        emptyIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        collectionEmpty: { type: "boolean" },
      },
      required: ["emptyIndices", "collectionEmpty"],
    },
    ports: {
      inputs: [
        {
          id: "memberTypes",
          label: "Member Types",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "emptyMembers",
          label: "Empty Members",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "emptyIndices",
          label: "Empty Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "collectionEmpty",
          label: "Collection Empty",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = geometryCollectionEmptyMemberRoleTool.execute;
export default geometryCollectionEmptyMemberRoleTool;
