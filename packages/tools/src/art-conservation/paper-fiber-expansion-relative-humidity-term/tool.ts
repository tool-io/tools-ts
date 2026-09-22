import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly expansionPerHumidityPoint: number;
  readonly humidityChangePoints: number;
};
export type Output = {
  readonly lengthChange: number;
  readonly finalLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "number", minimum: 0 },
    expansionPerHumidityPoint: { type: "number", minimum: 0 },
    humidityChangePoints: { type: "number" },
  },
  required: ["length", "expansionPerHumidityPoint", "humidityChangePoints"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lengthChange: { type: "number" },
    finalLength: { type: "number" },
  },
  required: ["lengthChange", "finalLength"],
} as const;
/** Caller-calibrated local linear hygroscopic expansion; humidity change is in percentage points, not a fractional RH change. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, expansionPerHumidityPoint, humidityChangePoints } = request;
  const compute = (): Output => {
    H.domain(
      length >= 0 &&
        expansionPerHumidityPoint >= 0 &&
        1 + expansionPerHumidityPoint * humidityChangePoints >= 0,
    );
    return {
      lengthChange: length * expansionPerHumidityPoint * humidityChangePoints,
      finalLength:
        length * (1 + expansionPerHumidityPoint * humidityChangePoints),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    length: 100,
    expansionPerHumidityPoint: 0.001,
    humidityChangePoints: 10,
  },
  output: { lengthChange: 1, finalLength: 101 },
} satisfies ToolExample<Input, Output>;
export const paperFiberExpansionRelativeHumidityTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "art-conservation/paper-fiber-expansion-relative-humidity-term",
      title: "Paper Fiber Expansion Relative Humidity Term Tool",
      description:
        "Caller-calibrated local linear hygroscopic expansion; humidity change is in percentage points, not a fractional RH change.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          length: { type: "number", minimum: 0 },
          expansionPerHumidityPoint: { type: "number", minimum: 0 },
          humidityChangePoints: { type: "number" },
        },
        required: [
          "length",
          "expansionPerHumidityPoint",
          "humidityChangePoints",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lengthChange: { type: "number" },
          finalLength: { type: "number" },
        },
        required: ["lengthChange", "finalLength"],
      },
      ports: {
        inputs: [
          {
            id: "length",
            label: "Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "expansionPerHumidityPoint",
            label: "Expansion Per Humidity Point",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "humidityChangePoints",
            label: "Humidity Change Points",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "lengthChange",
            label: "Length Change",
            valueType: { type: "number" },
          },
          {
            id: "finalLength",
            label: "Final Length",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = paperFiberExpansionRelativeHumidityTermTool.execute;
export default paperFiberExpansionRelativeHumidityTermTool;
