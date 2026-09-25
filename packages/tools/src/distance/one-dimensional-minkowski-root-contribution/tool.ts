import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly difference: number; readonly power: number };
export type Output = { readonly poweredContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    difference: { type: "number" },
    power: { type: "number", minimum: 1 },
  },
  required: ["difference", "power"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { poweredContribution: { type: "number" } },
  required: ["poweredContribution"],
} as const;
/** Calculate one dimensional minkowski root contribution from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { difference, power } = input;
  const compute = (): Output => {
    H.domain(power >= 1);
    return { poweredContribution: Math.abs(difference) ** power };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { difference: -3, power: 2 },
  output: { poweredContribution: 9 },
} satisfies ToolExample<Input, Output>;
export const oneDimensionalMinkowskiRootContributionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "distance/one-dimensional-minkowski-root-contribution",
      title: "One Dimensional Minkowski Root Contribution Tool",
      description:
        "Calculate one dimensional minkowski root contribution from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          difference: { type: "number" },
          power: { type: "number", minimum: 1 },
        },
        required: ["difference", "power"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { poweredContribution: { type: "number" } },
        required: ["poweredContribution"],
      },
      ports: {
        inputs: [
          {
            id: "difference",
            label: "Difference",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "power",
            label: "Power",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "poweredContribution",
            label: "Powered Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = oneDimensionalMinkowskiRootContributionTool.execute;
export default oneDimensionalMinkowskiRootContributionTool;
