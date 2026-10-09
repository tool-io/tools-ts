import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly measuredLength: number;
  readonly unitText: string;
  readonly axisWording: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    measuredLength: { type: "number", minimum: 0 },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
    axisWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["specimenId", "measuredLength", "unitText", "axisWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied carapace measurement axis and unit without converting straight and curved measurements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, measuredLength, unitText, axisWording } = request;
  const compute = (): Output => {
    H.domain(
      specimenId.length > 0 && unitText.length > 0 && axisWording.length > 0,
      "specimenId",
    );
    H.domain(measuredLength >= 0, "measuredLength");
    return {
      label:
        specimenId + "; " + axisWording + "=" + measuredLength + " " + unitText,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    specimenId: "T17",
    measuredLength: 120,
    unitText: "mm",
    axisWording: "straight carapace length",
  },
  output: { label: "T17; straight carapace length=120 mm" },
} satisfies ToolExample<Input, Output>;
export const turtleCarapaceAxisLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["herpetology", "biology"],
      keywords: ["herpetology", "biology"],
    },
    id: "herpetology/turtle-carapace-axis-label",
    title: "Turtle Carapace Axis Label",
    description:
      "Label an explicitly supplied carapace measurement axis and unit without converting straight and curved measurements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        measuredLength: { type: "number", minimum: 0 },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
        axisWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["specimenId", "measuredLength", "unitText", "axisWording"],
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
        {
          id: "axisWording",
          label: "Axis Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = turtleCarapaceAxisLabelTool.execute;
export default turtleCarapaceAxisLabelTool;
