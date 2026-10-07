import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pressure: number;
  readonly firstPressure: number;
  readonly secondPressure: number;
};
export type Output = { readonly secondLevelWeight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pressure: { type: "number", exclusiveMinimum: 0 },
    firstPressure: { type: "number", exclusiveMinimum: 0 },
    secondPressure: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["pressure", "firstPressure", "secondPressure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { secondLevelWeight: { type: "number" } },
  required: ["secondLevelWeight"],
} as const;
/** Calculate an explicit log-pressure coordinate weight between distinct positive pressure levels, permitting extrapolation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pressure, firstPressure, secondPressure } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(pressure) && pressure > 0, "pressure"), pressure);
    (H.domain(
      Number.isFinite(firstPressure) && firstPressure > 0,
      "firstPressure",
    ),
      firstPressure);
    (H.domain(
      Number.isFinite(secondPressure) && secondPressure > 0,
      "secondPressure",
    ),
      secondPressure);
    H.domain(firstPressure !== secondPressure, "secondPressure");
    const logRatio = (a: number, b: number): number => {
      const relative = (a - b) / b;
      return Number.isFinite(relative) && relative > -1
        ? Math.log1p(relative)
        : Math.log(a) - Math.log(b);
    };
    return {
      secondLevelWeight:
        pressure === firstPressure
          ? 0
          : pressure === secondPressure
            ? 1
            : logRatio(pressure, firstPressure) /
              logRatio(secondPressure, firstPressure),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pressure: 500, firstPressure: 1000, secondPressure: 250 },
  output: { secondLevelWeight: 0.5 },
} satisfies ToolExample<Input, Output>;
export const pressureLevelLogInterpolationWeightTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: [
          "atmospheric-science",
          "atmospheric science",
          "earth and environmental sciences",
        ],
        keywords: ["atmospheric science", "earth and environmental sciences"],
      },
      id: "atmospheric-science/pressure-level-log-interpolation-weight",
      title: "Pressure Level Log Interpolation Weight",
      description:
        "Calculate an explicit log-pressure coordinate weight between distinct positive pressure levels, permitting extrapolation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          pressure: { type: "number", exclusiveMinimum: 0 },
          firstPressure: { type: "number", exclusiveMinimum: 0 },
          secondPressure: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["pressure", "firstPressure", "secondPressure"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { secondLevelWeight: { type: "number" } },
        required: ["secondLevelWeight"],
      },
      ports: {
        inputs: [
          {
            id: "pressure",
            label: "Pressure",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstPressure",
            label: "First Pressure",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondPressure",
            label: "Second Pressure",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "secondLevelWeight",
            label: "Second Level Weight",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pressureLevelLogInterpolationWeightTool.execute;
export default pressureLevelLogInterpolationWeightTool;
