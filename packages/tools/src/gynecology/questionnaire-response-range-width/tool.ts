import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerResponse: number;
  readonly upperResponse: number;
  readonly suppliedUnitStep: number;
};
export type Output = { readonly width: number; readonly stepWidth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerResponse: { type: "number" },
    upperResponse: { type: "number" },
    suppliedUnitStep: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["lowerResponse", "upperResponse", "suppliedUnitStep"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { width: { type: "number" }, stepWidth: { type: "number" } },
  required: ["width", "stepWidth"],
} as const;
/** Measure a supplied research response interval without scoring symptoms or assigning clinical meaning. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lowerResponse, upperResponse, suppliedUnitStep } = request;
  const compute = (): Output => {
    H.domain(lowerResponse <= upperResponse);
    H.positive(suppliedUnitStep);
    return {
      width: upperResponse - lowerResponse,
      stepWidth: (upperResponse - lowerResponse) / suppliedUnitStep,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lowerResponse: 2, upperResponse: 8, suppliedUnitStep: 2 },
  output: { width: 6, stepWidth: 3 },
} satisfies ToolExample<Input, Output>;
export const questionnaireResponseRangeWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gynecology/questionnaire-response-range-width",
    title: "Questionnaire Response Range Width Tool",
    description:
      "Measure a supplied research response interval without scoring symptoms or assigning clinical meaning.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerResponse: { type: "number" },
        upperResponse: { type: "number" },
        suppliedUnitStep: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["lowerResponse", "upperResponse", "suppliedUnitStep"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { width: { type: "number" }, stepWidth: { type: "number" } },
      required: ["width", "stepWidth"],
    },
    ports: {
      inputs: [
        {
          id: "lowerResponse",
          label: "Lower Response",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperResponse",
          label: "Upper Response",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedUnitStep",
          label: "Supplied Unit Step",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "width", label: "Width", valueType: { type: "number" } },
        { id: "stepWidth", label: "Step Width", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = questionnaireResponseRangeWidthTool.execute;
export default questionnaireResponseRangeWidthTool;
