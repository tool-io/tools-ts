import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstBox: number;
  readonly lastBox: number;
  readonly foldersPerBox: number;
  readonly firstFolder: number;
  readonly lastFolder: number;
};
export type Output = { readonly folderCount: number; readonly boxSpan: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstBox: { type: "integer", minimum: 0 },
    lastBox: { type: "integer" },
    foldersPerBox: { type: "integer", minimum: 1 },
    firstFolder: { type: "integer", minimum: 1 },
    lastFolder: { type: "integer", minimum: 1 },
  },
  required: [
    "firstBox",
    "lastBox",
    "foldersPerBox",
    "firstFolder",
    "lastFolder",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    folderCount: { type: "integer" },
    boxSpan: { type: "integer" },
  },
  required: ["folderCount", "boxSpan"],
} as const;
/** Calculate glp archive box folder span count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstBox, lastBox, foldersPerBox, firstFolder, lastFolder } = request;
  const compute = (): Output => {
    H.integer(firstBox, 0);
    H.integer(lastBox, firstBox);
    H.integer(foldersPerBox, 1);
    H.integer(firstFolder, 1, foldersPerBox);
    H.integer(lastFolder, 1, foldersPerBox);
    H.domain(lastBox > firstBox || lastFolder >= firstFolder);
    return {
      folderCount: Number(
        (BigInt(lastBox) - BigInt(firstBox)) * BigInt(foldersPerBox) +
          BigInt(lastFolder) -
          BigInt(firstFolder) +
          1n,
      ),
      boxSpan: lastBox - firstBox + 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstBox: 1,
    lastBox: 3,
    foldersPerBox: 10,
    firstFolder: 4,
    lastFolder: 6,
  },
  output: { folderCount: 23, boxSpan: 3 },
} satisfies ToolExample<Input, Output>;
export const glpArchiveBoxFolderSpanCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "glp/glp-archive-box-folder-span-count",
    title: "GLP Archive Box Folder Span Count Tool",
    description:
      "Calculate glp archive box folder span count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstBox: { type: "integer", minimum: 0 },
        lastBox: { type: "integer" },
        foldersPerBox: { type: "integer", minimum: 1 },
        firstFolder: { type: "integer", minimum: 1 },
        lastFolder: { type: "integer", minimum: 1 },
      },
      required: [
        "firstBox",
        "lastBox",
        "foldersPerBox",
        "firstFolder",
        "lastFolder",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        folderCount: { type: "integer" },
        boxSpan: { type: "integer" },
      },
      required: ["folderCount", "boxSpan"],
    },
    ports: {
      inputs: [
        {
          id: "firstBox",
          label: "First Box",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lastBox",
          label: "Last Box",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "foldersPerBox",
          label: "Folders Per Box",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstFolder",
          label: "First Folder",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lastFolder",
          label: "Last Folder",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "folderCount",
          label: "Folder Count",
          valueType: { type: "integer" },
        },
        { id: "boxSpan", label: "Box Span", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = glpArchiveBoxFolderSpanCountTool.execute;
export default glpArchiveBoxFolderSpanCountTool;
