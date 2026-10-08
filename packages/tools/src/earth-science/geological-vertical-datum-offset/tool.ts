import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceElevation: number;
  readonly sourceToTargetOffset: number;
};
export type Output = { readonly targetElevation: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceElevation: { type: "number" },
    sourceToTargetOffset: { type: "number" },
  },
  required: ["sourceElevation", "sourceToTargetOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { targetElevation: { type: "number" } },
  required: ["targetElevation"],
} as const;
/** Apply an explicit additive geological vertical-datum offset without selecting or transforming a geodetic model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceElevation, sourceToTargetOffset } = request;
  const compute = (): Output => {
    return { targetElevation: sourceElevation + sourceToTargetOffset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceElevation: 120, sourceToTargetOffset: 2.5 },
  output: { targetElevation: 122.5 },
} satisfies ToolExample<Input, Output>;
export const geologicalVerticalDatumOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "earth-science",
        "earth science",
        "earth and environmental sciences",
      ],
      keywords: ["earth science", "earth and environmental sciences"],
    },
    id: "earth-science/geological-vertical-datum-offset",
    title: "Geological Vertical Datum Offset",
    description:
      "Apply an explicit additive geological vertical-datum offset without selecting or transforming a geodetic model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceElevation: { type: "number" },
        sourceToTargetOffset: { type: "number" },
      },
      required: ["sourceElevation", "sourceToTargetOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { targetElevation: { type: "number" } },
      required: ["targetElevation"],
    },
    ports: {
      inputs: [
        {
          id: "sourceElevation",
          label: "Source Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceToTargetOffset",
          label: "Source To Target Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "targetElevation",
          label: "Target Elevation",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = geologicalVerticalDatumOffsetTool.execute;
export default geologicalVerticalDatumOffsetTool;
