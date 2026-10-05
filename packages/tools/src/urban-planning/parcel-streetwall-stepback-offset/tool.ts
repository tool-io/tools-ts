import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerFacadeOffset: number;
  readonly upperFacadeOffset: number;
};
export type Output = { readonly stepback: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerFacadeOffset: { type: "number" },
    upperFacadeOffset: { type: "number" },
  },
  required: ["lowerFacadeOffset", "upperFacadeOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { stepback: { type: "number" } },
  required: ["stepback"],
} as const;
/** Describe the upper-minus-lower facade offset measured inward from the same street reference line; negative indicates projection. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lowerFacadeOffset, upperFacadeOffset } = request;
  const compute = (): Output => {
    return { stepback: upperFacadeOffset - lowerFacadeOffset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lowerFacadeOffset: 2, upperFacadeOffset: 5 },
  output: { stepback: 3 },
} satisfies ToolExample<Input, Output>;
export const parcelStreetwallStepbackOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/parcel-streetwall-stepback-offset",
    title: "Parcel Streetwall Stepback Offset Tool",
    description:
      "Describe the upper-minus-lower facade offset measured inward from the same street reference line; negative indicates projection.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerFacadeOffset: { type: "number" },
        upperFacadeOffset: { type: "number" },
      },
      required: ["lowerFacadeOffset", "upperFacadeOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { stepback: { type: "number" } },
      required: ["stepback"],
    },
    ports: {
      inputs: [
        {
          id: "lowerFacadeOffset",
          label: "Lower Facade Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperFacadeOffset",
          label: "Upper Facade Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "stepback", label: "Stepback", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = parcelStreetwallStepbackOffsetTool.execute;
export default parcelStreetwallStepbackOffsetTool;
