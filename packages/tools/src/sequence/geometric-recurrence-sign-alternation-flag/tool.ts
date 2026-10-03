import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly initial: number; readonly ratio: number };
export type Output = {
  readonly alternates: boolean;
  readonly identicallyZero: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { initial: { type: "number" }, ratio: { type: "number" } },
  required: ["initial", "ratio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    alternates: { type: "boolean" },
    identicallyZero: { type: "boolean" },
  },
  required: ["alternates", "identicallyZero"],
} as const;
/** Calculate geometric recurrence sign alternation flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initial, ratio } = request;
  const compute = (): Output => {
    return {
      alternates: initial !== 0 && ratio < 0,
      identicallyZero: initial === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initial: 2, ratio: -0.5 },
  output: { alternates: true, identicallyZero: false },
} satisfies ToolExample<Input, Output>;
export const geometricRecurrenceSignAlternationFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "sequence/geometric-recurrence-sign-alternation-flag",
      title: "Geometric Recurrence Sign Alternation Flag Tool",
      description:
        "Calculate geometric recurrence sign alternation flag from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { initial: { type: "number" }, ratio: { type: "number" } },
        required: ["initial", "ratio"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          alternates: { type: "boolean" },
          identicallyZero: { type: "boolean" },
        },
        required: ["alternates", "identicallyZero"],
      },
      ports: {
        inputs: [
          {
            id: "initial",
            label: "Initial",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "ratio",
            label: "Ratio",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "alternates",
            label: "Alternates",
            valueType: { type: "boolean" },
          },
          {
            id: "identicallyZero",
            label: "Identically Zero",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = geometricRecurrenceSignAlternationFlagTool.execute;
export default geometricRecurrenceSignAlternationFlagTool;
