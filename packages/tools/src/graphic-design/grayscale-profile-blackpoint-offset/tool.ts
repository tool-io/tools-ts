import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly channelValue: number;
  readonly suppliedBlackPoint: number;
};
export type Output = { readonly blackRelativeValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    channelValue: { type: "number" },
    suppliedBlackPoint: { type: "number" },
  },
  required: ["channelValue", "suppliedBlackPoint"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { blackRelativeValue: { type: "number" } },
  required: ["blackRelativeValue"],
} as const;
/** Remove an explicit grayscale profile black-point value in the same encoded channel space without nonlinear profile conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { channelValue, suppliedBlackPoint } = request;
  const compute = (): Output => {
    return { blackRelativeValue: channelValue - suppliedBlackPoint };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { channelValue: 0.5, suppliedBlackPoint: 0.1 },
  output: { blackRelativeValue: 0.4 },
} satisfies ToolExample<Input, Output>;
export const grayscaleProfileBlackpointOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/grayscale-profile-blackpoint-offset",
    title: "Grayscale Profile Blackpoint Offset Tool",
    description:
      "Remove an explicit grayscale profile black-point value in the same encoded channel space without nonlinear profile conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        channelValue: { type: "number" },
        suppliedBlackPoint: { type: "number" },
      },
      required: ["channelValue", "suppliedBlackPoint"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { blackRelativeValue: { type: "number" } },
      required: ["blackRelativeValue"],
    },
    ports: {
      inputs: [
        {
          id: "channelValue",
          label: "Channel Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedBlackPoint",
          label: "Supplied Black Point",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "blackRelativeValue",
          label: "Black Relative Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = grayscaleProfileBlackpointOffsetTool.execute;
export default grayscaleProfileBlackpointOffsetTool;
