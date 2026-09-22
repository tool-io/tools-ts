import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly depthMillimetres: number;
  readonly elapsedMinutes: number;
};
export type Output = { readonly millimetresPerHour: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depthMillimetres: { type: "number", minimum: 0 },
    elapsedMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["depthMillimetres", "elapsedMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { millimetresPerHour: { type: "number" } },
  required: ["millimetresPerHour"],
} as const;
/** Calculate precipitation rate depth interval factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { depthMillimetres, elapsedMinutes } = request;
  const compute = (): Output => {
    H.domain(depthMillimetres >= 0);
    H.positive(elapsedMinutes);
    return { millimetresPerHour: (60 * depthMillimetres) / elapsedMinutes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { depthMillimetres: 5, elapsedMinutes: 20 },
  output: { millimetresPerHour: 15 },
} satisfies ToolExample<Input, Output>;
export const precipitationRateDepthIntervalFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-science/precipitation-rate-depth-interval-factor",
      title: "Precipitation Rate Depth Interval Factor Tool",
      description:
        "Calculate precipitation rate depth interval factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          depthMillimetres: { type: "number", minimum: 0 },
          elapsedMinutes: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["depthMillimetres", "elapsedMinutes"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { millimetresPerHour: { type: "number" } },
        required: ["millimetresPerHour"],
      },
      ports: {
        inputs: [
          {
            id: "depthMillimetres",
            label: "Depth Millimetres",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "elapsedMinutes",
            label: "Elapsed Minutes",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "millimetresPerHour",
            label: "Millimetres Per Hour",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = precipitationRateDepthIntervalFactorTool.execute;
export default precipitationRateDepthIntervalFactorTool;
