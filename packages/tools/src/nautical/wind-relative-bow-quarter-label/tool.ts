import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly relativeSector: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    relativeSector: {
      type: "string",
      maxLength: 8192,
      enum: ["bow", "beam", "quarter", "stern", "unspecified"],
    },
  },
  required: ["recordId", "relativeSector"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly reported relative-wind sector without classifying a measured bearing or giving navigation advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, relativeSector } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(
      ["bow", "beam", "quarter", "stern", "unspecified"].includes(
        relativeSector,
      ),
      "relativeSector",
    );
    return { label: recordId + " [" + relativeSector + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "W17", relativeSector: "quarter" },
  output: { label: "W17 [quarter]" },
} satisfies ToolExample<Input, Output>;
export const windRelativeBowQuarterLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["nautical", "engineering"],
      keywords: ["nautical", "engineering"],
    },
    id: "nautical/wind-relative-bow-quarter-label",
    title: "Wind Relative Bow Quarter Label",
    description:
      "Label an explicitly reported relative-wind sector without classifying a measured bearing or giving navigation advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        relativeSector: {
          type: "string",
          maxLength: 8192,
          enum: ["bow", "beam", "quarter", "stern", "unspecified"],
        },
      },
      required: ["recordId", "relativeSector"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "relativeSector",
          label: "Relative Sector",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = windRelativeBowQuarterLabelTool.execute;
export default windRelativeBowQuarterLabelTool;
