import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly electroactiveArea: number;
  readonly geometricArea: number;
};
export type Output = {
  readonly roughnessFactor: number;
  readonly excessArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    electroactiveArea: { type: "number", minimum: 0 },
    geometricArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["electroactiveArea", "geometricArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roughnessFactor: { type: "number" },
    excessArea: { type: "number" },
  },
  required: ["roughnessFactor", "excessArea"],
} as const;
/** Calculate electrode geometric electroactive area ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { electroactiveArea, geometricArea } = request;
  const compute = (): Output => {
    H.domain(electroactiveArea >= 0);
    H.positive(geometricArea);
    return {
      roughnessFactor: electroactiveArea / geometricArea,
      excessArea: electroactiveArea - geometricArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { electroactiveArea: 30, geometricArea: 5 },
  output: { roughnessFactor: 6, excessArea: 25 },
} satisfies ToolExample<Input, Output>;
export const electrodeGeometricElectroactiveAreaRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electrochemistry/electrode-geometric-electroactive-area-ratio",
      title: "Electrode Geometric Electroactive Area Ratio Tool",
      description:
        "Calculate electrode geometric electroactive area ratio from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          electroactiveArea: { type: "number", minimum: 0 },
          geometricArea: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["electroactiveArea", "geometricArea"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          roughnessFactor: { type: "number" },
          excessArea: { type: "number" },
        },
        required: ["roughnessFactor", "excessArea"],
      },
      ports: {
        inputs: [
          {
            id: "electroactiveArea",
            label: "Electroactive Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "geometricArea",
            label: "Geometric Area",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "roughnessFactor",
            label: "Roughness Factor",
            valueType: { type: "number" },
          },
          {
            id: "excessArea",
            label: "Excess Area",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = electrodeGeometricElectroactiveAreaRatioTool.execute;
export default electrodeGeometricElectroactiveAreaRatioTool;
