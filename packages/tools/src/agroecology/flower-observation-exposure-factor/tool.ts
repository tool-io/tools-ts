import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flowers: number;
  readonly minutes: number;
  readonly referenceFlowerMinutes: number;
};
export type Output = { readonly exposure: number; readonly factor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flowers: { type: "integer", minimum: 0 },
    minutes: { type: "number", minimum: 0 },
    referenceFlowerMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["flowers", "minutes", "referenceFlowerMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { exposure: { type: "number" }, factor: { type: "number" } },
  required: ["exposure", "factor"],
} as const;
/** Calculate flower observation exposure factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flowers, minutes, referenceFlowerMinutes } = request;
  const compute = (): Output => {
    H.integer(flowers, 0);
    H.domain(minutes >= 0);
    H.positive(referenceFlowerMinutes);
    return {
      exposure: flowers * minutes,
      factor: (flowers * minutes) / referenceFlowerMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flowers: 10, minutes: 5, referenceFlowerMinutes: 100 },
  output: { exposure: 50, factor: 0.5 },
} satisfies ToolExample<Input, Output>;
export const flowerObservationExposureFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroecology/flower-observation-exposure-factor",
    title: "Flower Observation Exposure Factor Tool",
    description:
      "Calculate flower observation exposure factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flowers: { type: "integer", minimum: 0 },
        minutes: { type: "number", minimum: 0 },
        referenceFlowerMinutes: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["flowers", "minutes", "referenceFlowerMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { exposure: { type: "number" }, factor: { type: "number" } },
      required: ["exposure", "factor"],
    },
    ports: {
      inputs: [
        {
          id: "flowers",
          label: "Flowers",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "minutes",
          label: "Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceFlowerMinutes",
          label: "Reference Flower Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "exposure", label: "Exposure", valueType: { type: "number" } },
        { id: "factor", label: "Factor", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = flowerObservationExposureFactorTool.execute;
export default flowerObservationExposureFactorTool;
