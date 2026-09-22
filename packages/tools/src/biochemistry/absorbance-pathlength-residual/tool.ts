import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly absorbance: number;
  readonly pathLength: number;
  readonly suppliedAbsorbancePerLength: number;
};
export type Output = {
  readonly predictedAbsorbance: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    absorbance: { type: "number" },
    pathLength: { type: "number", minimum: 0 },
    suppliedAbsorbancePerLength: { type: "number" },
  },
  required: ["absorbance", "pathLength", "suppliedAbsorbancePerLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predictedAbsorbance: { type: "number" },
    residual: { type: "number" },
  },
  required: ["predictedAbsorbance", "residual"],
} as const;
/** Compare a supplied absorbance with an explicit linear per-length reference, without inferring analyte identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { absorbance, pathLength, suppliedAbsorbancePerLength } = request;
  const compute = (): Output => {
    H.domain(pathLength >= 0);
    return {
      predictedAbsorbance: pathLength * suppliedAbsorbancePerLength,
      residual: absorbance - pathLength * suppliedAbsorbancePerLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { absorbance: 0.8, pathLength: 2, suppliedAbsorbancePerLength: 0.3 },
  output: { predictedAbsorbance: 0.6, residual: 0.20000000000000007 },
} satisfies ToolExample<Input, Output>;
export const absorbancePathlengthResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biochemistry/absorbance-pathlength-residual",
    title: "Absorbance Pathlength Residual Tool",
    description:
      "Compare a supplied absorbance with an explicit linear per-length reference, without inferring analyte identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        absorbance: { type: "number" },
        pathLength: { type: "number", minimum: 0 },
        suppliedAbsorbancePerLength: { type: "number" },
      },
      required: ["absorbance", "pathLength", "suppliedAbsorbancePerLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        predictedAbsorbance: { type: "number" },
        residual: { type: "number" },
      },
      required: ["predictedAbsorbance", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "absorbance",
          label: "Absorbance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pathLength",
          label: "Path Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedAbsorbancePerLength",
          label: "Supplied Absorbance Per Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "predictedAbsorbance",
          label: "Predicted Absorbance",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = absorbancePathlengthResidualTool.execute;
export default absorbancePathlengthResidualTool;
