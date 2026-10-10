import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedLeaves: number;
  readonly countBothSides: boolean;
};
export type Output = { readonly potentialPageSides: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedLeaves: { type: "integer", minimum: 0 },
    countBothSides: { type: "boolean" },
  },
  required: ["recordedLeaves", "countBothSides"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { potentialPageSides: { type: "integer" } },
  required: ["potentialPageSides"],
} as const;
/** Convert an explicit leaf count to a supplied one-side or two-side counting basis without inferring blank or missing pages. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedLeaves, countBothSides } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(recordedLeaves) &&
        recordedLeaves >= 0 &&
        recordedLeaves <= Number.MAX_SAFE_INTEGER,
      "recordedLeaves",
    ),
      recordedLeaves);
    return {
      potentialPageSides: Number(
        BigInt(recordedLeaves) * (countBothSides ? 2n : 1n),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedLeaves: 12, countBothSides: true },
  output: { potentialPageSides: 24 },
} satisfies ToolExample<Input, Output>;
export const archiveFolderLeafCountCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "library-science",
        "library science",
        "information and language sciences",
      ],
      keywords: ["library science", "information and language sciences"],
    },
    id: "library-science/archive-folder-leaf-count-crosswalk",
    title: "Archive Folder Leaf Count Crosswalk",
    description:
      "Convert an explicit leaf count to a supplied one-side or two-side counting basis without inferring blank or missing pages.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedLeaves: { type: "integer", minimum: 0 },
        countBothSides: { type: "boolean" },
      },
      required: ["recordedLeaves", "countBothSides"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { potentialPageSides: { type: "integer" } },
      required: ["potentialPageSides"],
    },
    ports: {
      inputs: [
        {
          id: "recordedLeaves",
          label: "Recorded Leaves",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "countBothSides",
          label: "Count Both Sides",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "potentialPageSides",
          label: "Potential Page Sides",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = archiveFolderLeafCountCrosswalkTool.execute;
export default archiveFolderLeafCountCrosswalkTool;
