import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly trainingPrior: number;
  readonly targetPrior: number;
};
export type Output = { readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trainingPrior: { type: "number" },
    targetPrior: { type: "number" },
  },
  required: ["trainingPrior", "targetPrior"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offset: { type: "number" } },
  required: ["offset"],
} as const;
/** Compute binary prior shift logit offset from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { trainingPrior, targetPrior } = input;
  const compute = (): Output => {
    domain(
      trainingPrior > 0 &&
        trainingPrior < 1 &&
        targetPrior > 0 &&
        targetPrior < 1,
    );
    return {
      offset:
        Math.log(targetPrior / (1 - targetPrior)) -
        Math.log(trainingPrior / (1 - trainingPrior)),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { trainingPrior: 0.5, targetPrior: 0.75 },
  output: { offset: 1.0986122886681096 },
} satisfies ToolExample<Input, Output>;
export const binaryPriorShiftLogitOffsetTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "classification/binary-prior-shift-logit-offset",
  title: "Binary Prior Shift Logit Offset Tool",
  description:
    "Compute binary prior shift logit offset from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "trainingPrior",
        label: "Training Prior",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "targetPrior",
        label: "Target Prior",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [{ id: "offset", label: "Offset", valueType: { type: "number" } }],
  },
});
export const run = binaryPriorShiftLogitOffsetTool.execute;
export default binaryPriorShiftLogitOffsetTool;
