import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceArea: number;
  readonly sourceToTargetFactor: number;
};
export type Output = { readonly targetArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceArea: { type: "number", minimum: 0 },
    sourceToTargetFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sourceArea", "sourceToTargetFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { targetArea: { type: "number" } },
  required: ["targetArea"],
} as const;
/** Apply an explicit supplied floor-area basis factor without inferring measurement standards. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceArea, sourceToTargetFactor } = request;
  const compute = (): Output => {
    H.domain(sourceArea >= 0);
    H.positive(sourceToTargetFactor);
    return { targetArea: sourceArea * sourceToTargetFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceArea: 100, sourceToTargetFactor: 0.8 },
  output: { targetArea: 80 },
} satisfies ToolExample<Input, Output>;
export const floorAreaBasisFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "real-estate/floor-area-basis-factor",
    title: "Floor Area Basis Factor Tool",
    description:
      "Apply an explicit supplied floor-area basis factor without inferring measurement standards.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceArea: { type: "number", minimum: 0 },
        sourceToTargetFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["sourceArea", "sourceToTargetFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { targetArea: { type: "number" } },
      required: ["targetArea"],
    },
    ports: {
      inputs: [
        {
          id: "sourceArea",
          label: "Source Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceToTargetFactor",
          label: "Source To Target Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "targetArea",
          label: "Target Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = floorAreaBasisFactorTool.execute;
export default floorAreaBasisFactorTool;
