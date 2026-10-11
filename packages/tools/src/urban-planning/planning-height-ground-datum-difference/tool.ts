import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedGroundDatumElevation: number;
  readonly recordedTopElevation: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedGroundDatumElevation: { type: "number" },
    recordedTopElevation: { type: "number" },
  },
  required: ["suppliedGroundDatumElevation", "recordedTopElevation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract an explicit ground datum elevation from a recorded top elevation without selecting planning height definitions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedGroundDatumElevation, recordedTopElevation } = request;
  const compute = (): Output => {
    return { signedGap: recordedTopElevation - suppliedGroundDatumElevation };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedGroundDatumElevation: 12, recordedTopElevation: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const planningHeightGroundDatumDifferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["urban-planning", "urban planning", "arts and design"],
        keywords: ["urban planning", "arts and design"],
      },
      id: "urban-planning/planning-height-ground-datum-difference",
      title: "Planning Height Ground Datum Difference",
      description:
        "Subtract an explicit ground datum elevation from a recorded top elevation without selecting planning height definitions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          suppliedGroundDatumElevation: { type: "number" },
          recordedTopElevation: { type: "number" },
        },
        required: ["suppliedGroundDatumElevation", "recordedTopElevation"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { signedGap: { type: "number" } },
        required: ["signedGap"],
      },
      ports: {
        inputs: [
          {
            id: "suppliedGroundDatumElevation",
            label: "Supplied Ground Datum Elevation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "recordedTopElevation",
            label: "Recorded Top Elevation",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signedGap",
            label: "Signed Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = planningHeightGroundDatumDifferenceTool.execute;
export default planningHeightGroundDatumDifferenceTool;
