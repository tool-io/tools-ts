import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectionCode: string;
  readonly box: number;
  readonly folder: number;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectionCode: { type: "string", maxLength: 8192 },
    box: { type: "integer", minimum: 1 },
    folder: { type: "integer", minimum: 1 },
  },
  required: ["collectionCode", "box", "folder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Format explicit collection, box and folder storage coordinates without asserting the item is currently held there. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collectionCode, box, folder } = request;
  const compute = (): Output => {
    H.domain(collectionCode.length > 0, "collectionCode");
    (H.domain(
      Number.isSafeInteger(box) && box >= 1 && box <= Number.MAX_SAFE_INTEGER,
      "box",
    ),
      box);
    (H.domain(
      Number.isSafeInteger(folder) &&
        folder >= 1 &&
        folder <= Number.MAX_SAFE_INTEGER,
      "folder",
    ),
      folder);
    return { token: collectionCode + " / box " + box + " / folder " + folder };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { collectionCode: "MS-17", box: 3, folder: 12 },
  output: { token: "MS-17 / box 3 / folder 12" },
} satisfies ToolExample<Input, Output>;
export const archivalBoxFolderLocationTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/archival-box-folder-location-token",
    title: "Archival Box Folder Location Token Tool",
    description:
      "Format explicit collection, box and folder storage coordinates without asserting the item is currently held there.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectionCode: { type: "string", maxLength: 8192 },
        box: { type: "integer", minimum: 1 },
        folder: { type: "integer", minimum: 1 },
      },
      required: ["collectionCode", "box", "folder"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "collectionCode",
          label: "Collection Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "box",
          label: "Box",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "folder",
          label: "Folder",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = archivalBoxFolderLocationTokenTool.execute;
export default archivalBoxFolderLocationTokenTool;
