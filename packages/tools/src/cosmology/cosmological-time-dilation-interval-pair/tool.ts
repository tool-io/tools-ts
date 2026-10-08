import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly restInterval: number;
  readonly redshift: number;
};
export type Output = {
  readonly observedInterval: number;
  readonly dilationFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    restInterval: { type: "number", minimum: 0 },
    redshift: { type: "number", exclusiveMinimum: -1 },
  },
  required: ["restInterval", "redshift"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedInterval: { type: "number" },
    dilationFactor: { type: "number" },
  },
  required: ["observedInterval", "dilationFactor"],
} as const;
/** Apply cosmological observed-to-rest interval factor 1+z using an explicit redshift greater than minus one. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { restInterval, redshift } = request;
  const compute = (): Output => {
    H.domain(restInterval >= 0, "restInterval");
    H.domain(redshift > -1, "redshift");
    return {
      observedInterval: restInterval * (1 + redshift),
      dilationFactor: 1 + redshift,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { restInterval: 10, redshift: 2 },
  output: { observedInterval: 30, dilationFactor: 3 },
} satisfies ToolExample<Input, Output>;
export const cosmologicalTimeDilationIntervalPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["cosmology", "physics"],
        keywords: ["cosmology", "physics"],
      },
      id: "cosmology/cosmological-time-dilation-interval-pair",
      title: "Cosmological Time Dilation Interval Pair",
      description:
        "Apply cosmological observed-to-rest interval factor 1+z using an explicit redshift greater than minus one.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          restInterval: { type: "number", minimum: 0 },
          redshift: { type: "number", exclusiveMinimum: -1 },
        },
        required: ["restInterval", "redshift"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedInterval: { type: "number" },
          dilationFactor: { type: "number" },
        },
        required: ["observedInterval", "dilationFactor"],
      },
      ports: {
        inputs: [
          {
            id: "restInterval",
            label: "Rest Interval",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "redshift",
            label: "Redshift",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "observedInterval",
            label: "Observed Interval",
            valueType: { type: "number" },
          },
          {
            id: "dilationFactor",
            label: "Dilation Factor",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = cosmologicalTimeDilationIntervalPairTool.execute;
export default cosmologicalTimeDilationIntervalPairTool;
