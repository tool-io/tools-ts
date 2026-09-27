import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly firstLeg: number; readonly secondLeg: number };
export type Output = { readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLeg: { type: "number", minimum: 0 },
    secondLeg: { type: "number", minimum: 0 },
  },
  required: ["firstLeg", "secondLeg"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residual: { type: "number" } },
  required: ["residual"],
} as const;
/** Calculate dart leg length residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstLeg, secondLeg } = request;
  const compute = (): Output => {
    H.domain(firstLeg >= 0 && secondLeg >= 0);
    return { residual: firstLeg - secondLeg };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstLeg: 12.5, secondLeg: 12 },
  output: { residual: 0.5 },
} satisfies ToolExample<Input, Output>;
export const dartLegLengthResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/dart-leg-length-residual",
    title: "Dart Leg Length Residual Tool",
    description:
      "Calculate dart leg length residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLeg: { type: "number", minimum: 0 },
        secondLeg: { type: "number", minimum: 0 },
      },
      required: ["firstLeg", "secondLeg"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { residual: { type: "number" } },
      required: ["residual"],
    },
    ports: {
      inputs: [
        {
          id: "firstLeg",
          label: "First Leg",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondLeg",
          label: "Second Leg",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = dartLegLengthResidualTool.execute;
export default dartLegLengthResidualTool;
