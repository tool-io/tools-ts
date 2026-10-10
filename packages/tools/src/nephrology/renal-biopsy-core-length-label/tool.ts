import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly measuredLength: number;
  readonly unitText: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    measuredLength: { type: "number", minimum: 0 },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["specimenId", "measuredLength", "unitText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly measured renal-biopsy core length without assessing tissue adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, measuredLength, unitText } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0 && unitText.length > 0, "specimenId");
    H.domain(measuredLength >= 0, "measuredLength");
    return {
      label: specimenId + "; core length=" + measuredLength + " " + unitText,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { specimenId: "S17", measuredLength: 12, unitText: "mm" },
  output: { label: "S17; core length=12 mm" },
} satisfies ToolExample<Input, Output>;
export const renalBiopsyCoreLengthLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["nephrology", "health and medicine"],
      keywords: ["nephrology", "health and medicine"],
    },
    id: "nephrology/renal-biopsy-core-length-label",
    title: "Renal Biopsy Core Length Label",
    description:
      "Label an explicitly measured renal-biopsy core length without assessing tissue adequacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        measuredLength: { type: "number", minimum: 0 },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["specimenId", "measuredLength", "unitText"],
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
          id: "specimenId",
          label: "Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "measuredLength",
          label: "Measured Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitText",
          label: "Unit Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = renalBiopsyCoreLengthLabelTool.execute;
export default renalBiopsyCoreLengthLabelTool;
