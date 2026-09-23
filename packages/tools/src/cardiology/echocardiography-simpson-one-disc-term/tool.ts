import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly diameterFirst: number;
  readonly diameterSecond: number;
  readonly discHeight: number;
};
export type Output = {
  readonly crossSectionArea: number;
  readonly discVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diameterFirst: { type: "number", minimum: 0 },
    diameterSecond: { type: "number", minimum: 0 },
    discHeight: { type: "number", minimum: 0 },
  },
  required: ["diameterFirst", "diameterSecond", "discHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    crossSectionArea: { type: "number" },
    discVolume: { type: "number" },
  },
  required: ["crossSectionArea", "discVolume"],
} as const;
/** One biplane elliptical disk volume contribution from supplied model dimensions, not a complete ventricular Simpson measurement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { diameterFirst, diameterSecond, discHeight } = request;
  const compute = (): Output => {
    H.domain(diameterFirst >= 0 && diameterSecond >= 0 && discHeight >= 0);
    return {
      crossSectionArea: (Math.PI * diameterFirst * diameterSecond) / 4,
      discVolume: (Math.PI * diameterFirst * diameterSecond * discHeight) / 4,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { diameterFirst: 4, diameterSecond: 3, discHeight: 0.5 },
  output: { crossSectionArea: 9.42477796076938, discVolume: 4.71238898038469 },
} satisfies ToolExample<Input, Output>;
export const echocardiographySimpsonOneDiscTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cardiology/echocardiography-simpson-one-disc-term",
    title: "Echocardiography Simpson One Disc Term Tool",
    description:
      "One biplane elliptical disk volume contribution from supplied model dimensions, not a complete ventricular Simpson measurement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        diameterFirst: { type: "number", minimum: 0 },
        diameterSecond: { type: "number", minimum: 0 },
        discHeight: { type: "number", minimum: 0 },
      },
      required: ["diameterFirst", "diameterSecond", "discHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        crossSectionArea: { type: "number" },
        discVolume: { type: "number" },
      },
      required: ["crossSectionArea", "discVolume"],
    },
    ports: {
      inputs: [
        {
          id: "diameterFirst",
          label: "Diameter First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "diameterSecond",
          label: "Diameter Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "discHeight",
          label: "Disc Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "crossSectionArea",
          label: "Cross Section Area",
          valueType: { type: "number" },
        },
        {
          id: "discVolume",
          label: "Disc Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = echocardiographySimpsonOneDiscTermTool.execute;
export default echocardiographySimpsonOneDiscTermTool;
