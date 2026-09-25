import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly input: number;
  readonly halfWidth: number;
  readonly measuredOutput: number;
};
export type Output = {
  readonly expectedOutput: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    input: { type: "number" },
    halfWidth: { type: "number", minimum: 0 },
    measuredOutput: { type: "number" },
  },
  required: ["input", "halfWidth", "measuredOutput"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedOutput: { type: "number" },
    residual: { type: "number" },
  },
  required: ["expectedOutput", "residual"],
} as const;
/** Compare an explicit symmetric continuous deadzone with a measured output. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { input, halfWidth, measuredOutput } = request;
  const compute = (): Output => {
    H.domain(halfWidth >= 0);
    return {
      expectedOutput:
        Math.abs(input) <= halfWidth ? 0 : input - Math.sign(input) * halfWidth,
      residual:
        measuredOutput -
        (Math.abs(input) <= halfWidth
          ? 0
          : input - Math.sign(input) * halfWidth),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { input: 5, halfWidth: 2, measuredOutput: 4 },
  output: { expectedOutput: 3, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const deadzoneOutputResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/deadzone-output-residual",
    title: "Deadzone Output Residual Tool",
    description:
      "Compare an explicit symmetric continuous deadzone with a measured output.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        input: { type: "number" },
        halfWidth: { type: "number", minimum: 0 },
        measuredOutput: { type: "number" },
      },
      required: ["input", "halfWidth", "measuredOutput"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedOutput: { type: "number" },
        residual: { type: "number" },
      },
      required: ["expectedOutput", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "input",
          label: "Input",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "halfWidth",
          label: "Half Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredOutput",
          label: "Measured Output",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedOutput",
          label: "Expected Output",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = deadzoneOutputResidualTool.execute;
export default deadzoneOutputResidualTool;
