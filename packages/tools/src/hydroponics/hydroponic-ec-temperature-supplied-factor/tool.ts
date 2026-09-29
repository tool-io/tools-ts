import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedEc: number;
  readonly temperature: number;
  readonly referenceTemperature: number;
  readonly coefficient: number;
};
export type Output = { readonly referenceEc: number; readonly factor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedEc: { type: "number", minimum: 0 },
    temperature: { type: "number" },
    referenceTemperature: { type: "number" },
    coefficient: { type: "number" },
  },
  required: [
    "observedEc",
    "temperature",
    "referenceTemperature",
    "coefficient",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { referenceEc: { type: "number" }, factor: { type: "number" } },
  required: ["referenceEc", "factor"],
} as const;
/** Apply an explicitly supplied linear conductivity temperature coefficient. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedEc, temperature, referenceTemperature, coefficient } =
    request;
  const compute = (): Output => {
    H.domain(
      observedEc >= 0 &&
        1 + coefficient * (temperature - referenceTemperature) > 0,
    );
    return {
      referenceEc:
        observedEc / (1 + coefficient * (temperature - referenceTemperature)),
      factor: 1 / (1 + coefficient * (temperature - referenceTemperature)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedEc: 2,
    temperature: 30,
    referenceTemperature: 20,
    coefficient: 0.02,
  },
  output: { referenceEc: 1.6666666666666667, factor: 0.8333333333333334 },
} satisfies ToolExample<Input, Output>;
export const hydroponicEcTemperatureSuppliedFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hydroponics/hydroponic-ec-temperature-supplied-factor",
      title: "Hydroponic EC Temperature Supplied Factor Tool",
      description:
        "Apply an explicitly supplied linear conductivity temperature coefficient.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedEc: { type: "number", minimum: 0 },
          temperature: { type: "number" },
          referenceTemperature: { type: "number" },
          coefficient: { type: "number" },
        },
        required: [
          "observedEc",
          "temperature",
          "referenceTemperature",
          "coefficient",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referenceEc: { type: "number" },
          factor: { type: "number" },
        },
        required: ["referenceEc", "factor"],
      },
      ports: {
        inputs: [
          {
            id: "observedEc",
            label: "Observed Ec",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "temperature",
            label: "Temperature",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceTemperature",
            label: "Reference Temperature",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "coefficient",
            label: "Coefficient",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "referenceEc",
            label: "Reference Ec",
            valueType: { type: "number" },
          },
          { id: "factor", label: "Factor", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = hydroponicEcTemperatureSuppliedFactorTool.execute;
export default hydroponicEcTemperatureSuppliedFactorTool;
