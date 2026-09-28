import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly membersJson: string };
export type Output = {
  readonly valid: boolean;
  readonly nullIndexes: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { membersJson: { type: "string", maxLength: 8192 } },
  required: ["membersJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valid: { type: "boolean" },
    nullIndexes: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["valid", "nullIndexes"],
} as const;
/** Check only the prohibition of null direct GeometryCollection members; valid=true does not establish full geometry validity. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { membersJson } = input;
  const compute = (): Output => {
    const members = H.list(H.parseJson(membersJson)),
      nullIndexes = members.flatMap((x, i) => (x === null ? [i] : []));
    return { valid: nullIndexes.length === 0, nullIndexes };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { membersJson: '[null,{"type":"Point","coordinates":[1,2]}]' },
  output: { valid: false, nullIndexes: [0] },
} satisfies ToolExample<Input, Output>;
export const geometryCollectionNullMemberRejectionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geojson/geometry-collection-null-member-rejection",
      title: "Geometry Collection Null Member Rejection Tool",
      description:
        "Check only the prohibition of null direct GeometryCollection members; valid=true does not establish full geometry validity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { membersJson: { type: "string", maxLength: 8192 } },
        required: ["membersJson"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          valid: { type: "boolean" },
          nullIndexes: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
        },
        required: ["valid", "nullIndexes"],
      },
      ports: {
        inputs: [
          {
            id: "membersJson",
            label: "Members Json",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "valid", label: "Valid", valueType: { type: "boolean" } },
          {
            id: "nullIndexes",
            label: "Null Indexes",
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = geometryCollectionNullMemberRejectionTool.execute;
export default geometryCollectionNullMemberRejectionTool;
