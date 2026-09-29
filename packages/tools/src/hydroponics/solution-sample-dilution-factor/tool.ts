import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleVolume: number;
  readonly diluentVolume: number;
};
export type Output = { readonly finalVolume: number; readonly factor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleVolume: { type: "number", exclusiveMinimum: 0 },
    diluentVolume: { type: "number", minimum: 0 },
  },
  required: ["sampleVolume", "diluentVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { finalVolume: { type: "number" }, factor: { type: "number" } },
  required: ["finalVolume", "factor"],
} as const;
/** Calculate solution sample dilution factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleVolume, diluentVolume } = request;
  const compute = (): Output => {
    H.positive(sampleVolume);
    H.domain(diluentVolume >= 0);
    return {
      finalVolume: sampleVolume + diluentVolume,
      factor: (sampleVolume + diluentVolume) / sampleVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleVolume: 2, diluentVolume: 8 },
  output: { finalVolume: 10, factor: 5 },
} satisfies ToolExample<Input, Output>;
export const solutionSampleDilutionFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydroponics/solution-sample-dilution-factor",
    title: "Solution Sample Dilution Factor Tool",
    description:
      "Calculate solution sample dilution factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleVolume: { type: "number", exclusiveMinimum: 0 },
        diluentVolume: { type: "number", minimum: 0 },
      },
      required: ["sampleVolume", "diluentVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        finalVolume: { type: "number" },
        factor: { type: "number" },
      },
      required: ["finalVolume", "factor"],
    },
    ports: {
      inputs: [
        {
          id: "sampleVolume",
          label: "Sample Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "diluentVolume",
          label: "Diluent Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "finalVolume",
          label: "Final Volume",
          valueType: { type: "number" },
        },
        { id: "factor", label: "Factor", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = solutionSampleDilutionFactorTool.execute;
export default solutionSampleDilutionFactorTool;
