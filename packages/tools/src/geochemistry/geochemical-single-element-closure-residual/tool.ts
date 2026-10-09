import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredMass: number;
  readonly expectedMass: number;
};
export type Output = { readonly residualMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredMass: { type: "number", minimum: 0 },
    expectedMass: { type: "number", minimum: 0 },
  },
  required: ["measuredMass", "expectedMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residualMass: { type: "number" } },
  required: ["residualMass"],
} as const;
/** Subtract a supplied expected mass from measured mass for one element without compositional fitting. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredMass, expectedMass } = request;
  const compute = (): Output => {
    H.domain(measuredMass >= 0 && expectedMass >= 0, "measuredMass");
    return { residualMass: measuredMass - expectedMass };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredMass: 12, expectedMass: 10 },
  output: { residualMass: 2 },
} satisfies ToolExample<Input, Output>;
export const geochemicalSingleElementClosureResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["geochemistry", "chemistry"],
        keywords: ["geochemistry", "chemistry"],
      },
      id: "geochemistry/geochemical-single-element-closure-residual",
      title: "Geochemical Single Element Closure Residual",
      description:
        "Subtract a supplied expected mass from measured mass for one element without compositional fitting.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          measuredMass: { type: "number", minimum: 0 },
          expectedMass: { type: "number", minimum: 0 },
        },
        required: ["measuredMass", "expectedMass"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { residualMass: { type: "number" } },
        required: ["residualMass"],
      },
      ports: {
        inputs: [
          {
            id: "measuredMass",
            label: "Measured Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "expectedMass",
            label: "Expected Mass",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "residualMass",
            label: "Residual Mass",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = geochemicalSingleElementClosureResidualTool.execute;
export default geochemicalSingleElementClosureResidualTool;
