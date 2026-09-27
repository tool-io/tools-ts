import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beforeLength: number;
  readonly afterLength: number;
  readonly beforeStitchesPerUnit: number;
};
export type Output = {
  readonly lengthFactor: number;
  readonly afterStitchesPerUnit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeLength: { type: "number", exclusiveMinimum: 0 },
    afterLength: { type: "number", exclusiveMinimum: 0 },
    beforeStitchesPerUnit: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["beforeLength", "afterLength", "beforeStitchesPerUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lengthFactor: { type: "number" },
    afterStitchesPerUnit: { type: "number" },
  },
  required: ["lengthFactor", "afterStitchesPerUnit"],
} as const;
/** Calculate knitted gauge washed unwashed factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beforeLength, afterLength, beforeStitchesPerUnit } = request;
  const compute = (): Output => {
    H.positive(beforeLength);
    H.positive(afterLength);
    H.positive(beforeStitchesPerUnit);
    return {
      lengthFactor: afterLength / beforeLength,
      afterStitchesPerUnit:
        (beforeStitchesPerUnit * beforeLength) / afterLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { beforeLength: 20, afterLength: 18, beforeStitchesPerUnit: 2 },
  output: { lengthFactor: 0.9, afterStitchesPerUnit: 2.2222222222222223 },
} satisfies ToolExample<Input, Output>;
export const knittedGaugeWashedUnwashedFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/knitted-gauge-washed-unwashed-factor",
    title: "Knitted Gauge Washed Unwashed Factor Tool",
    description:
      "Calculate knitted gauge washed unwashed factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beforeLength: { type: "number", exclusiveMinimum: 0 },
        afterLength: { type: "number", exclusiveMinimum: 0 },
        beforeStitchesPerUnit: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["beforeLength", "afterLength", "beforeStitchesPerUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lengthFactor: { type: "number" },
        afterStitchesPerUnit: { type: "number" },
      },
      required: ["lengthFactor", "afterStitchesPerUnit"],
    },
    ports: {
      inputs: [
        {
          id: "beforeLength",
          label: "Before Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "afterLength",
          label: "After Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "beforeStitchesPerUnit",
          label: "Before Stitches Per Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lengthFactor",
          label: "Length Factor",
          valueType: { type: "number" },
        },
        {
          id: "afterStitchesPerUnit",
          label: "After Stitches Per Unit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = knittedGaugeWashedUnwashedFactorTool.execute;
export default knittedGaugeWashedUnwashedFactorTool;
