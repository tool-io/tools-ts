import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly voltage: number;
  readonly sourceResistance: number;
  readonly loadResistance: number;
};
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voltage: { type: "number" },
    sourceResistance: { type: "number", minimum: 0 },
    loadResistance: { type: "number", minimum: 0 },
  },
  required: ["voltage", "sourceResistance", "loadResistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Calculate resistor thevenin load current sensitivity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { voltage, sourceResistance, loadResistance } = request;
  const compute = (): Output => {
    H.domain(
      sourceResistance >= 0 &&
        loadResistance >= 0 &&
        sourceResistance + loadResistance > 0,
    );
    return { derivative: -voltage / (sourceResistance + loadResistance) ** 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { voltage: 12, sourceResistance: 2, loadResistance: 4 },
  output: { derivative: -0.3333333333333333 },
} satisfies ToolExample<Input, Output>;
export const resistorTheveninLoadCurrentSensitivityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electricity/resistor-thevenin-load-current-sensitivity",
      title: "Resistor Thevenin Load Current Sensitivity Tool",
      description:
        "Calculate resistor thevenin load current sensitivity from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          voltage: { type: "number" },
          sourceResistance: { type: "number", minimum: 0 },
          loadResistance: { type: "number", minimum: 0 },
        },
        required: ["voltage", "sourceResistance", "loadResistance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { derivative: { type: "number" } },
        required: ["derivative"],
      },
      ports: {
        inputs: [
          {
            id: "voltage",
            label: "Voltage",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sourceResistance",
            label: "Source Resistance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "loadResistance",
            label: "Load Resistance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "derivative",
            label: "Derivative",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = resistorTheveninLoadCurrentSensitivityTool.execute;
export default resistorTheveninLoadCurrentSensitivityTool;
