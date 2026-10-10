import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly witnessStatus: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    witnessStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["firsthand", "secondhand", "mixed", "unknown"],
    },
  },
  required: ["recordId", "witnessStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded witness-source relationship without assessing historical reliability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, witnessStatus } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(
      ["firsthand", "secondhand", "mixed", "unknown"].includes(witnessStatus),
      "witnessStatus",
    );
    return { label: recordId + " [" + witnessStatus + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", witnessStatus: "secondhand" },
  output: { label: "R17 [secondhand]" },
} satisfies ToolExample<Input, Output>;
export const historicalWitnessFirsthandSecondhandCodeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["history", "humanities"],
        keywords: ["history", "humanities"],
      },
      id: "history/historical-witness-firsthand-secondhand-code",
      title: "Historical Witness Firsthand Secondhand Code",
      description:
        "Label an explicitly recorded witness-source relationship without assessing historical reliability.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          witnessStatus: {
            type: "string",
            maxLength: 8192,
            enum: ["firsthand", "secondhand", "mixed", "unknown"],
          },
        },
        required: ["recordId", "witnessStatus"],
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
            id: "witnessStatus",
            label: "Witness Status",
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
export const run = historicalWitnessFirsthandSecondhandCodeTool.execute;
export default historicalWitnessFirsthandSecondhandCodeTool;
