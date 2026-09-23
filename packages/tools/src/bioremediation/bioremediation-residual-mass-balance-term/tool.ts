import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opening: number;
  readonly input: number;
  readonly output: number;
  readonly sampled: number;
  readonly measuredClosing: number;
};
export type Output = {
  readonly expectedClosing: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opening: { type: "number", minimum: 0 },
    input: { type: "number", minimum: 0 },
    output: { type: "number", minimum: 0 },
    sampled: { type: "number", minimum: 0 },
    measuredClosing: { type: "number", minimum: 0 },
  },
  required: ["opening", "input", "output", "sampled", "measuredClosing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedClosing: { type: "number" },
    residual: { type: "number" },
  },
  required: ["expectedClosing", "residual"],
} as const;
/** Calculate bioremediation residual mass balance term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { opening, input, output, sampled, measuredClosing } = request;
  const compute = (): Output => {
    H.domain(
      opening >= 0 &&
        input >= 0 &&
        output >= 0 &&
        sampled >= 0 &&
        measuredClosing >= 0,
    );
    return {
      expectedClosing: opening + input - output - sampled,
      residual: measuredClosing - opening - input + output + sampled,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    opening: 100,
    input: 20,
    output: 30,
    sampled: 5,
    measuredClosing: 80,
  },
  output: { expectedClosing: 85, residual: -5 },
} satisfies ToolExample<Input, Output>;
export const bioremediationResidualMassBalanceTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioremediation/bioremediation-residual-mass-balance-term",
      title: "Bioremediation Residual Mass Balance Term Tool",
      description:
        "Calculate bioremediation residual mass balance term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          opening: { type: "number", minimum: 0 },
          input: { type: "number", minimum: 0 },
          output: { type: "number", minimum: 0 },
          sampled: { type: "number", minimum: 0 },
          measuredClosing: { type: "number", minimum: 0 },
        },
        required: ["opening", "input", "output", "sampled", "measuredClosing"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          expectedClosing: { type: "number" },
          residual: { type: "number" },
        },
        required: ["expectedClosing", "residual"],
      },
      ports: {
        inputs: [
          {
            id: "opening",
            label: "Opening",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "input",
            label: "Input",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "output",
            label: "Output",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sampled",
            label: "Sampled",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "measuredClosing",
            label: "Measured Closing",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "expectedClosing",
            label: "Expected Closing",
            valueType: { type: "number" },
          },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = bioremediationResidualMassBalanceTermTool.execute;
export default bioremediationResidualMassBalanceTermTool;
