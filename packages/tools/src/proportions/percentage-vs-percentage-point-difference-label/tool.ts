import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beforePercent: number;
  readonly afterPercent: number;
};
export type Output = {
  readonly percentagePoints: number;
  readonly relativePercent: number;
  readonly relativeDefined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforePercent: { type: "number" },
    afterPercent: { type: "number" },
  },
  required: ["beforePercent", "afterPercent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    percentagePoints: { type: "number" },
    relativePercent: { type: "number" },
    relativeDefined: { type: "boolean" },
  },
  required: ["percentagePoints", "relativePercent", "relativeDefined"],
} as const;
/** Calculate percentage vs percentage point difference label from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { beforePercent, afterPercent } = input;
  const compute = (): Output => {
    const relativeDefined = beforePercent !== 0;
    return {
      percentagePoints: afterPercent - beforePercent,
      relativePercent: relativeDefined
        ? ((afterPercent - beforePercent) / beforePercent) * 100
        : 0,
      relativeDefined,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { beforePercent: 20, afterPercent: 25 },
  output: { percentagePoints: 5, relativePercent: 25, relativeDefined: true },
} satisfies ToolExample<Input, Output>;
export const percentageVsPercentagePointDifferenceLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "proportions/percentage-vs-percentage-point-difference-label",
      title: "Percentage Vs Percentage Point Difference Label Tool",
      description:
        "Calculate percentage vs percentage point difference label from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          beforePercent: { type: "number" },
          afterPercent: { type: "number" },
        },
        required: ["beforePercent", "afterPercent"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          percentagePoints: { type: "number" },
          relativePercent: { type: "number" },
          relativeDefined: { type: "boolean" },
        },
        required: ["percentagePoints", "relativePercent", "relativeDefined"],
      },
      ports: {
        inputs: [
          {
            id: "beforePercent",
            label: "Before Percent",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "afterPercent",
            label: "After Percent",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "percentagePoints",
            label: "Percentage Points",
            valueType: { type: "number" },
          },
          {
            id: "relativePercent",
            label: "Relative Percent",
            valueType: { type: "number" },
          },
          {
            id: "relativeDefined",
            label: "Relative Defined",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = percentageVsPercentagePointDifferenceLabelTool.execute;
export default percentageVsPercentagePointDifferenceLabelTool;
