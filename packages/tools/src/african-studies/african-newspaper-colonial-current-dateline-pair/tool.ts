import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly historicalName: string;
  readonly currentName: string;
  readonly sourceDate: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    historicalName: { type: "string", maxLength: 8192 },
    currentName: { type: "string", maxLength: 8192 },
    sourceDate: { type: "string", maxLength: 8192 },
  },
  required: ["historicalName", "currentName", "sourceDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Display explicitly supplied historical and current place-name fields without establishing an authority match or endorsing historical terminology. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { historicalName, currentName, sourceDate } = request;
  const compute = (): Output => {
    H.domain(
      historicalName.length > 0 &&
        currentName.length > 0 &&
        sourceDate.length > 0,
      "historicalName",
    );
    return {
      label:
        historicalName +
        " [source: " +
        sourceDate +
        "]; current-name annotation: " +
        currentName,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    historicalName: "Historical Place",
    currentName: "Current Place",
    sourceDate: "1920-05-01",
  },
  output: {
    label:
      "Historical Place [source: 1920-05-01]; current-name annotation: Current Place",
  },
} satisfies ToolExample<Input, Output>;
export const africanNewspaperColonialCurrentDatelinePairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "african-studies/african-newspaper-colonial-current-dateline-pair",
      title: "African Newspaper Colonial Current Dateline Pair Tool",
      description:
        "Display explicitly supplied historical and current place-name fields without establishing an authority match or endorsing historical terminology.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          historicalName: { type: "string", maxLength: 8192 },
          currentName: { type: "string", maxLength: 8192 },
          sourceDate: { type: "string", maxLength: 8192 },
        },
        required: ["historicalName", "currentName", "sourceDate"],
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
            id: "historicalName",
            label: "Historical Name",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "currentName",
            label: "Current Name",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sourceDate",
            label: "Source Date",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = africanNewspaperColonialCurrentDatelinePairTool.execute;
export default africanNewspaperColonialCurrentDatelinePairTool;
