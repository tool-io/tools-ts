import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pressureChange: number;
  readonly elapsedHours: number;
};
export type Output = { readonly threeHourChange: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pressureChange: { type: "number" },
    elapsedHours: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["pressureChange", "elapsedHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { threeHourChange: { type: "number" } },
  required: ["threeHourChange"],
} as const;
/** Calculate pressure tendency three hour normalizer from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pressureChange, elapsedHours } = request;
  const compute = (): Output => {
    H.positive(elapsedHours);
    return { threeHourChange: (3 * pressureChange) / elapsedHours };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pressureChange: -2, elapsedHours: 2 },
  output: { threeHourChange: -3 },
} satisfies ToolExample<Input, Output>;
export const pressureTendencyThreeHourNormalizerTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-science/pressure-tendency-three-hour-normalizer",
      title: "Pressure Tendency Three Hour Normalizer Tool",
      description:
        "Calculate pressure tendency three hour normalizer from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          pressureChange: { type: "number" },
          elapsedHours: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["pressureChange", "elapsedHours"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { threeHourChange: { type: "number" } },
        required: ["threeHourChange"],
      },
      ports: {
        inputs: [
          {
            id: "pressureChange",
            label: "Pressure Change",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "elapsedHours",
            label: "Elapsed Hours",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "threeHourChange",
            label: "Three Hour Change",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pressureTendencyThreeHourNormalizerTool.execute;
export default pressureTendencyThreeHourNormalizerTool;
