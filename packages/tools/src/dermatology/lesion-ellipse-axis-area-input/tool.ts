import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fullMajorAxis: number;
  readonly fullMinorAxis: number;
};
export type Output = { readonly ellipticalArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullMajorAxis: { type: "number" },
    fullMinorAxis: { type: "number", minimum: 0 },
  },
  required: ["fullMajorAxis", "fullMinorAxis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ellipticalArea: { type: "number" } },
  required: ["ellipticalArea"],
} as const;
/** Calculate the geometric ellipse area defined by two supplied full axes without characterizing a lesion or recommending care. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fullMajorAxis, fullMinorAxis } = request;
  const compute = (): Output => {
    H.domain(
      fullMajorAxis >= fullMinorAxis && fullMinorAxis >= 0,
      "fullMajorAxis",
    );
    return {
      ellipticalArea: Math.PI * (fullMajorAxis / 2) * (fullMinorAxis / 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fullMajorAxis: 4, fullMinorAxis: 2 },
  output: { ellipticalArea: 6.283185307179586 },
} satisfies ToolExample<Input, Output>;
export const lesionEllipseAxisAreaInputTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["dermatology", "health and medicine"],
      keywords: ["dermatology", "health and medicine"],
    },
    id: "dermatology/lesion-ellipse-axis-area-input",
    title: "Lesion Ellipse Axis Area Input",
    description:
      "Calculate the geometric ellipse area defined by two supplied full axes without characterizing a lesion or recommending care.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fullMajorAxis: { type: "number" },
        fullMinorAxis: { type: "number", minimum: 0 },
      },
      required: ["fullMajorAxis", "fullMinorAxis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ellipticalArea: { type: "number" } },
      required: ["ellipticalArea"],
    },
    ports: {
      inputs: [
        {
          id: "fullMajorAxis",
          label: "Full Major Axis",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fullMinorAxis",
          label: "Full Minor Axis",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "ellipticalArea",
          label: "Elliptical Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lesionEllipseAxisAreaInputTool.execute;
export default lesionEllipseAxisAreaInputTool;
