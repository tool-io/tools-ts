import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly jointPresent: number;
  readonly jointAbsent: number;
  readonly disagreements: number;
};
export type Output = { readonly score: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    jointPresent: { type: "integer" },
    jointAbsent: { type: "integer" },
    disagreements: { type: "integer" },
  },
  required: ["jointPresent", "jointAbsent", "disagreements"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { score: { type: "number" } },
  required: ["score"],
} as const;
/** Calculate rogers tanimoto one disagreement term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { jointPresent, jointAbsent, disagreements } = request;
  const compute = (): Output => {
    for (const x of [jointPresent, jointAbsent, disagreements]) H.integer(x, 0);
    const same = jointPresent + jointAbsent,
      d = same + 2 * disagreements;
    H.positive(d);
    return { score: same / d };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { jointPresent: 3, jointAbsent: 5, disagreements: 2 },
  output: { score: 0.6666666666666666 },
} satisfies ToolExample<Input, Output>;
export const rogersTanimotoOneDisagreementTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/rogers-tanimoto-one-disagreement-term",
    title: "Rogers Tanimoto One Disagreement Term Tool",
    description:
      "Calculate rogers tanimoto one disagreement term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        jointPresent: { type: "integer" },
        jointAbsent: { type: "integer" },
        disagreements: { type: "integer" },
      },
      required: ["jointPresent", "jointAbsent", "disagreements"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { score: { type: "number" } },
      required: ["score"],
    },
    ports: {
      inputs: [
        {
          id: "jointPresent",
          label: "Joint Present",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "jointAbsent",
          label: "Joint Absent",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "disagreements",
          label: "Disagreements",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "score", label: "Score", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = rogersTanimotoOneDisagreementTermTool.execute;
export default rogersTanimotoOneDisagreementTermTool;
