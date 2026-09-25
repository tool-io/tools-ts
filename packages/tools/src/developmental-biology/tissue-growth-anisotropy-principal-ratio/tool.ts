import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStretch: number;
  readonly secondStretch: number;
  readonly initialArea: number;
};
export type Output = {
  readonly anisotropy: number;
  readonly finalArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStretch: { type: "number", exclusiveMinimum: 0 },
    secondStretch: { type: "number", exclusiveMinimum: 0 },
    initialArea: { type: "number", minimum: 0 },
  },
  required: ["firstStretch", "secondStretch", "initialArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { anisotropy: { type: "number" }, finalArea: { type: "number" } },
  required: ["anisotropy", "finalArea"],
} as const;
/** Calculate tissue growth anisotropy principal ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStretch, secondStretch, initialArea } = request;
  const compute = (): Output => {
    H.positive(firstStretch);
    H.positive(secondStretch);
    H.domain(initialArea >= 0);
    return {
      anisotropy: firstStretch / secondStretch,
      finalArea: initialArea * firstStretch * secondStretch,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstStretch: 1.5, secondStretch: 1.2, initialArea: 100 },
  output: { anisotropy: 1.25, finalArea: 180 },
} satisfies ToolExample<Input, Output>;
export const tissueGrowthAnisotropyPrincipalRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "developmental-biology/tissue-growth-anisotropy-principal-ratio",
      title: "Tissue Growth Anisotropy Principal Ratio Tool",
      description:
        "Calculate tissue growth anisotropy principal ratio from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstStretch: { type: "number", exclusiveMinimum: 0 },
          secondStretch: { type: "number", exclusiveMinimum: 0 },
          initialArea: { type: "number", minimum: 0 },
        },
        required: ["firstStretch", "secondStretch", "initialArea"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          anisotropy: { type: "number" },
          finalArea: { type: "number" },
        },
        required: ["anisotropy", "finalArea"],
      },
      ports: {
        inputs: [
          {
            id: "firstStretch",
            label: "First Stretch",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondStretch",
            label: "Second Stretch",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "initialArea",
            label: "Initial Area",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "anisotropy",
            label: "Anisotropy",
            valueType: { type: "number" },
          },
          {
            id: "finalArea",
            label: "Final Area",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = tissueGrowthAnisotropyPrincipalRatioTool.execute;
export default tissueGrowthAnisotropyPrincipalRatioTool;
