import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceCredits: number;
  readonly hoursPerSourceCredit: number;
  readonly hoursPerTargetCredit: number;
};
export type Output = { readonly targetCredits: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceCredits: { type: "number", minimum: 0 },
    hoursPerSourceCredit: { type: "number", exclusiveMinimum: 0 },
    hoursPerTargetCredit: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sourceCredits", "hoursPerSourceCredit", "hoursPerTargetCredit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { targetCredits: { type: "number" } },
  required: ["targetCredits"],
} as const;
/** Calculate credit hour equivalence factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceCredits, hoursPerSourceCredit, hoursPerTargetCredit } = request;
  const compute = (): Output => {
    H.domain(sourceCredits >= 0);
    H.positive(hoursPerSourceCredit);
    H.positive(hoursPerTargetCredit);
    return {
      targetCredits:
        (sourceCredits * hoursPerSourceCredit) / hoursPerTargetCredit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceCredits: 3,
    hoursPerSourceCredit: 10,
    hoursPerTargetCredit: 15,
  },
  output: { targetCredits: 2 },
} satisfies ToolExample<Input, Output>;
export const creditHourEquivalenceFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "adult-education/credit-hour-equivalence-factor",
    title: "Credit Hour Equivalence Factor Tool",
    description:
      "Calculate credit hour equivalence factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceCredits: { type: "number", minimum: 0 },
        hoursPerSourceCredit: { type: "number", exclusiveMinimum: 0 },
        hoursPerTargetCredit: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "sourceCredits",
        "hoursPerSourceCredit",
        "hoursPerTargetCredit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { targetCredits: { type: "number" } },
      required: ["targetCredits"],
    },
    ports: {
      inputs: [
        {
          id: "sourceCredits",
          label: "Source Credits",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hoursPerSourceCredit",
          label: "Hours Per Source Credit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hoursPerTargetCredit",
          label: "Hours Per Target Credit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "targetCredits",
          label: "Target Credits",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = creditHourEquivalenceFactorTool.execute;
export default creditHourEquivalenceFactorTool;
