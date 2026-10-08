import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly majorAxisLength: number;
  readonly minorAxisLength: number;
};
export type Output = { readonly axisRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    majorAxisLength: { type: "number" },
    minorAxisLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["majorAxisLength", "minorAxisLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { axisRatio: { type: "number" } },
  required: ["axisRatio"],
} as const;
/** Divide explicit major by positive minor tissue-axis length without assigning a morphogenesis model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { majorAxisLength, minorAxisLength } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(minorAxisLength) && minorAxisLength > 0,
      "minorAxisLength",
    ),
      minorAxisLength);
    H.domain(majorAxisLength >= minorAxisLength, "majorAxisLength");
    H.domain(majorAxisLength >= minorAxisLength, "majorAxisLength");
    return { axisRatio: majorAxisLength / minorAxisLength };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { majorAxisLength: 12, minorAxisLength: 4 },
  output: { axisRatio: 3 },
} satisfies ToolExample<Input, Output>;
export const developingTissueAnisotropyAxisRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "developmental-biology/developing-tissue-anisotropy-axis-ratio",
      title: "Developing Tissue Anisotropy Axis Ratio Tool",
      description:
        "Divide explicit major by positive minor tissue-axis length without assigning a morphogenesis model.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          majorAxisLength: { type: "number" },
          minorAxisLength: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["majorAxisLength", "minorAxisLength"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { axisRatio: { type: "number" } },
        required: ["axisRatio"],
      },
      ports: {
        inputs: [
          {
            id: "majorAxisLength",
            label: "Major Axis Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "minorAxisLength",
            label: "Minor Axis Length",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "axisRatio",
            label: "Axis Ratio",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = developingTissueAnisotropyAxisRatioTool.execute;
export default developingTissueAnisotropyAxisRatioTool;
