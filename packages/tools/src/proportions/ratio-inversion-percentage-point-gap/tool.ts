import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly ratio: number };
export type Output = {
  readonly inverse: number;
  readonly gapPercentagePoints: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inverse: { type: "number" },
    gapPercentagePoints: { type: "number" },
  },
  required: ["inverse", "gapPercentagePoints"],
} as const;
/** Calculate ratio inversion percentage point gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ratio } = request;
  const compute = (): Output => {
    H.domain(ratio !== 0);
    const inverse = 1 / ratio;
    return { inverse, gapPercentagePoints: 100 * (inverse - ratio) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ratio: 2 },
  output: { inverse: 0.5, gapPercentagePoints: -150 },
} satisfies ToolExample<Input, Output>;
export const ratioInversionPercentagePointGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/ratio-inversion-percentage-point-gap",
    title: "Ratio Inversion Percentage Point Gap Tool",
    description:
      "Calculate ratio inversion percentage point gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" } },
      required: ["ratio"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inverse: { type: "number" },
        gapPercentagePoints: { type: "number" },
      },
      required: ["inverse", "gapPercentagePoints"],
    },
    ports: {
      inputs: [
        {
          id: "ratio",
          label: "Ratio",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "inverse", label: "Inverse", valueType: { type: "number" } },
        {
          id: "gapPercentagePoints",
          label: "Gap Percentage Points",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ratioInversionPercentagePointGapTool.execute;
export default ratioInversionPercentagePointGapTool;
