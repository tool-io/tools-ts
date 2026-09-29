import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inputMass: number;
  readonly inputMoisture: number;
  readonly outputMass: number;
  readonly outputMoisture: number;
};
export type Output = {
  readonly dryInput: number;
  readonly dryOutput: number;
  readonly dryYield: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputMass: { type: "number", exclusiveMinimum: 0 },
    inputMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    outputMass: { type: "number", minimum: 0 },
    outputMoisture: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["inputMass", "inputMoisture", "outputMass", "outputMoisture"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryInput: { type: "number" },
    dryOutput: { type: "number" },
    dryYield: { type: "number" },
  },
  required: ["dryInput", "dryOutput", "dryYield"],
} as const;
/** Calculate tablet batch yield dry mass factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inputMass, inputMoisture, outputMass, outputMoisture } = request;
  const compute = (): Output => {
    H.positive(inputMass);
    H.domain(
      inputMoisture >= 0 &&
        inputMoisture < 1 &&
        outputMass >= 0 &&
        outputMoisture >= 0 &&
        outputMoisture <= 1,
    );
    return {
      dryInput: inputMass * (1 - inputMoisture),
      dryOutput: outputMass * (1 - outputMoisture),
      dryYield:
        (outputMass * (1 - outputMoisture)) / (inputMass * (1 - inputMoisture)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    inputMass: 100,
    inputMoisture: 0.2,
    outputMass: 90,
    outputMoisture: 0.1,
  },
  output: { dryInput: 80, dryOutput: 81, dryYield: 1.0125 },
} satisfies ToolExample<Input, Output>;
export const tabletBatchYieldDryMassFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-pharmacy/tablet-batch-yield-dry-mass-factor",
    title: "Tablet Batch Yield Dry Mass Factor Tool",
    description:
      "Calculate tablet batch yield dry mass factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inputMass: { type: "number", exclusiveMinimum: 0 },
        inputMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        outputMass: { type: "number", minimum: 0 },
        outputMoisture: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["inputMass", "inputMoisture", "outputMass", "outputMoisture"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryInput: { type: "number" },
        dryOutput: { type: "number" },
        dryYield: { type: "number" },
      },
      required: ["dryInput", "dryOutput", "dryYield"],
    },
    ports: {
      inputs: [
        {
          id: "inputMass",
          label: "Input Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inputMoisture",
          label: "Input Moisture",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outputMass",
          label: "Output Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outputMoisture",
          label: "Output Moisture",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dryInput", label: "Dry Input", valueType: { type: "number" } },
        { id: "dryOutput", label: "Dry Output", valueType: { type: "number" } },
        { id: "dryYield", label: "Dry Yield", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = tabletBatchYieldDryMassFactorTool.execute;
export default tabletBatchYieldDryMassFactorTool;
