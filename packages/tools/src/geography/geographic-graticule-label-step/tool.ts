import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly index: number;
  readonly stepDegrees: number;
  readonly originDegrees: number;
};
export type Output = { readonly degrees: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    index: { type: "integer" },
    stepDegrees: { type: "number", exclusiveMinimum: 0 },
    originDegrees: { type: "number" },
  },
  required: ["index", "stepDegrees", "originDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { degrees: { type: "number" } },
  required: ["degrees"],
} as const;
/** Calculate geographic graticule label step from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { index, stepDegrees, originDegrees } = request;
  const compute = (): Output => {
    H.positive(stepDegrees);
    return { degrees: originDegrees + index * stepDegrees };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { index: 3, stepDegrees: 5, originDegrees: -10 },
  output: { degrees: 5 },
} satisfies ToolExample<Input, Output>;
export const geographicGraticuleLabelStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/geographic-graticule-label-step",
    title: "Geographic Graticule Label Step Tool",
    description:
      "Calculate geographic graticule label step from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        index: { type: "integer" },
        stepDegrees: { type: "number", exclusiveMinimum: 0 },
        originDegrees: { type: "number" },
      },
      required: ["index", "stepDegrees", "originDegrees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { degrees: { type: "number" } },
      required: ["degrees"],
    },
    ports: {
      inputs: [
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "stepDegrees",
          label: "Step Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originDegrees",
          label: "Origin Degrees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "degrees", label: "Degrees", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = geographicGraticuleLabelStepTool.execute;
export default geographicGraticuleLabelStepTool;
