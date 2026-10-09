import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly teethLength: number;
  readonly topStopAllowance: number;
  readonly bottomStopAllowance: number;
};
export type Output = { readonly overallRecordedLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    teethLength: { type: "number", minimum: 0 },
    topStopAllowance: { type: "number", minimum: 0 },
    bottomStopAllowance: { type: "number", minimum: 0 },
  },
  required: ["teethLength", "topStopAllowance", "bottomStopAllowance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overallRecordedLength: { type: "number" } },
  required: ["overallRecordedLength"],
} as const;
/** Add explicit zipper teeth length and end allowances on compatible length units without inferring a manufacturer size. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { teethLength, topStopAllowance, bottomStopAllowance } = request;
  const compute = (): Output => {
    H.domain(
      teethLength >= 0 && topStopAllowance >= 0 && bottomStopAllowance >= 0,
      "teethLength",
    );
    return {
      overallRecordedLength:
        teethLength + topStopAllowance + bottomStopAllowance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { teethLength: 200, topStopAllowance: 5, bottomStopAllowance: 10 },
  output: { overallRecordedLength: 215 },
} satisfies ToolExample<Input, Output>;
export const zipperTeethStopLengthCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["fashion", "arts and design"],
      keywords: ["fashion", "arts and design"],
    },
    id: "fashion/zipper-teeth-stop-length-crosswalk",
    title: "Zipper Teeth Stop Length Crosswalk",
    description:
      "Add explicit zipper teeth length and end allowances on compatible length units without inferring a manufacturer size.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        teethLength: { type: "number", minimum: 0 },
        topStopAllowance: { type: "number", minimum: 0 },
        bottomStopAllowance: { type: "number", minimum: 0 },
      },
      required: ["teethLength", "topStopAllowance", "bottomStopAllowance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { overallRecordedLength: { type: "number" } },
      required: ["overallRecordedLength"],
    },
    ports: {
      inputs: [
        {
          id: "teethLength",
          label: "Teeth Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "topStopAllowance",
          label: "Top Stop Allowance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bottomStopAllowance",
          label: "Bottom Stop Allowance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "overallRecordedLength",
          label: "Overall Recorded Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = zipperTeethStopLengthCrosswalkTool.execute;
export default zipperTeethStopLengthCrosswalkTool;
