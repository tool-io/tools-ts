import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly firstFlow: number; readonly secondFlow: number };
export type Output = {
  readonly relativeRange: number;
  readonly minimumMeanRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstFlow: { type: "number", minimum: 0 },
    secondFlow: { type: "number", minimum: 0 },
  },
  required: ["firstFlow", "secondFlow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativeRange: { type: "number" },
    minimumMeanRatio: { type: "number" },
  },
  required: ["relativeRange", "minimumMeanRatio"],
} as const;
/** Calculate dripper emission uniformity one pair term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstFlow, secondFlow } = request;
  const compute = (): Output => {
    H.domain(firstFlow >= 0 && secondFlow >= 0 && firstFlow + secondFlow > 0);
    return {
      relativeRange:
        (2 * Math.abs(firstFlow - secondFlow)) / (firstFlow + secondFlow),
      minimumMeanRatio:
        (2 * Math.min(firstFlow, secondFlow)) / (firstFlow + secondFlow),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstFlow: 8, secondFlow: 12 },
  output: { relativeRange: 0.4, minimumMeanRatio: 0.8 },
} satisfies ToolExample<Input, Output>;
export const dripperEmissionUniformityOnePairTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hydroponics/dripper-emission-uniformity-one-pair-term",
      title: "Dripper Emission Uniformity One Pair Term Tool",
      description:
        "Calculate dripper emission uniformity one pair term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstFlow: { type: "number", minimum: 0 },
          secondFlow: { type: "number", minimum: 0 },
        },
        required: ["firstFlow", "secondFlow"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          relativeRange: { type: "number" },
          minimumMeanRatio: { type: "number" },
        },
        required: ["relativeRange", "minimumMeanRatio"],
      },
      ports: {
        inputs: [
          {
            id: "firstFlow",
            label: "First Flow",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondFlow",
            label: "Second Flow",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "relativeRange",
            label: "Relative Range",
            valueType: { type: "number" },
          },
          {
            id: "minimumMeanRatio",
            label: "Minimum Mean Ratio",
            valueType: { type: "number", unit: "1" },
          },
        ],
      },
    },
    calculate,
  });
export const run = dripperEmissionUniformityOnePairTermTool.execute;
export default dripperEmissionUniformityOnePairTermTool;
