import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mapId: string;
  readonly rowOneBased: number;
  readonly columnOneBased: number;
};
export type Output = { readonly locationKey: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mapId: { type: "string", maxLength: 8192, minLength: 1 },
    rowOneBased: { type: "integer", minimum: 1 },
    columnOneBased: { type: "integer", minimum: 1 },
  },
  required: ["mapId", "rowOneBased", "columnOneBased"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { locationKey: { type: "string", maxLength: 8192 } },
  required: ["locationKey"],
} as const;
/** Build an ordered key for an explicitly supplied one-based dermatology patch-map position without assigning allergens. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mapId, rowOneBased, columnOneBased } = request;
  const compute = (): Output => {
    H.domain(mapId.length > 0, "mapId");
    (H.domain(
      Number.isSafeInteger(rowOneBased) &&
        rowOneBased >= 1 &&
        rowOneBased <= Number.MAX_SAFE_INTEGER,
      "rowOneBased",
    ),
      rowOneBased);
    (H.domain(
      Number.isSafeInteger(columnOneBased) &&
        columnOneBased >= 1 &&
        columnOneBased <= Number.MAX_SAFE_INTEGER,
      "columnOneBased",
    ),
      columnOneBased);
    return {
      locationKey: JSON.stringify([mapId, rowOneBased, columnOneBased]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mapId: "M17", rowOneBased: 2, columnOneBased: 4 },
  output: { locationKey: '["M17",2,4]' },
} satisfies ToolExample<Input, Output>;
export const patchMapRowColumnTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dermatology/patch-map-row-column-token",
    title: "Patch Map Row Column Token Tool",
    description:
      "Build an ordered key for an explicitly supplied one-based dermatology patch-map position without assigning allergens.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mapId: { type: "string", maxLength: 8192, minLength: 1 },
        rowOneBased: { type: "integer", minimum: 1 },
        columnOneBased: { type: "integer", minimum: 1 },
      },
      required: ["mapId", "rowOneBased", "columnOneBased"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { locationKey: { type: "string", maxLength: 8192 } },
      required: ["locationKey"],
    },
    ports: {
      inputs: [
        {
          id: "mapId",
          label: "Map Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "rowOneBased",
          label: "Row One Based",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "columnOneBased",
          label: "Column One Based",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "locationKey",
          label: "Location Key",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = patchMapRowColumnTokenTool.execute;
export default patchMapRowColumnTokenTool;
