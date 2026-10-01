import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly height: number;
  readonly uncertainty: number;
  readonly required: number;
};
export type Output = {
  readonly conservativeHeight: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    height: { type: "number" },
    uncertainty: { type: "number", minimum: 0 },
    required: { type: "number" },
  },
  required: ["height", "uncertainty", "required"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conservativeHeight: { type: "number" },
    margin: { type: "number" },
  },
  required: ["conservativeHeight", "margin"],
} as const;
/** Calculate tide height observation uncertainty margin from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { height, uncertainty, required } = request;
  const compute = (): Output => {
    H.domain(uncertainty >= 0);
    const conservativeHeight = height - uncertainty;
    return { conservativeHeight, margin: conservativeHeight - required };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { height: 3, uncertainty: 0.2, required: 2.5 },
  output: { conservativeHeight: 2.8, margin: 0.2999999999999998 },
} satisfies ToolExample<Input, Output>;
export const tideHeightObservationUncertaintyMarginTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "nautical/tide-height-observation-uncertainty-margin",
      title: "Tide Height Observation Uncertainty Margin Tool",
      description:
        "Calculate tide height observation uncertainty margin from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          height: { type: "number" },
          uncertainty: { type: "number", minimum: 0 },
          required: { type: "number" },
        },
        required: ["height", "uncertainty", "required"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          conservativeHeight: { type: "number" },
          margin: { type: "number" },
        },
        required: ["conservativeHeight", "margin"],
      },
      ports: {
        inputs: [
          {
            id: "height",
            label: "Height",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "uncertainty",
            label: "Uncertainty",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "required",
            label: "Required",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "conservativeHeight",
            label: "Conservative Height",
            valueType: { type: "number" },
          },
          { id: "margin", label: "Margin", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = tideHeightObservationUncertaintyMarginTool.execute;
export default tideHeightObservationUncertaintyMarginTool;
