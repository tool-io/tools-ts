import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baselineProbability: number;
  readonly newProbability: number;
};
export type Output = {
  readonly absoluteChange: number;
  readonly relativeChange: number;
  readonly relativeDefined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baselineProbability: { type: "number", minimum: 0, maximum: 1 },
    newProbability: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["baselineProbability", "newProbability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    absoluteChange: { type: "number" },
    relativeChange: { type: "number" },
    relativeDefined: { type: "boolean" },
  },
  required: ["absoluteChange", "relativeChange", "relativeDefined"],
} as const;
/** Calculate benefit description absolute relative gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baselineProbability, newProbability } = request;
  const compute = (): Output => {
    H.probability(baselineProbability);
    H.probability(newProbability);
    return {
      absoluteChange: newProbability - baselineProbability,
      relativeChange:
        baselineProbability === 0
          ? 0
          : (newProbability - baselineProbability) / baselineProbability,
      relativeDefined: baselineProbability !== 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baselineProbability: 0.2, newProbability: 0.3 },
  output: {
    absoluteChange: 0.09999999999999998,
    relativeChange: 0.4999999999999999,
    relativeDefined: true,
  },
} satisfies ToolExample<Input, Output>;
export const benefitDescriptionAbsoluteRelativeGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioethics/benefit-description-absolute-relative-gap",
      title: "Benefit Description Absolute Relative Gap Tool",
      description:
        "Calculate benefit description absolute relative gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          baselineProbability: { type: "number", minimum: 0, maximum: 1 },
          newProbability: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["baselineProbability", "newProbability"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          absoluteChange: { type: "number" },
          relativeChange: { type: "number" },
          relativeDefined: { type: "boolean" },
        },
        required: ["absoluteChange", "relativeChange", "relativeDefined"],
      },
      ports: {
        inputs: [
          {
            id: "baselineProbability",
            label: "Baseline Probability",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "newProbability",
            label: "New Probability",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "absoluteChange",
            label: "Absolute Change",
            valueType: { type: "number" },
          },
          {
            id: "relativeChange",
            label: "Relative Change",
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
export const run = benefitDescriptionAbsoluteRelativeGapTool.execute;
export default benefitDescriptionAbsoluteRelativeGapTool;
