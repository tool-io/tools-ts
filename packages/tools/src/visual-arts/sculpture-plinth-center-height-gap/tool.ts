import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plinthHeight: number;
  readonly sculptureHeight: number;
  readonly centerFraction: number;
  readonly referenceEyeHeight: number;
};
export type Output = { readonly centerHeight: number; readonly eyeGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plinthHeight: { type: "number", minimum: 0 },
    sculptureHeight: { type: "number", minimum: 0 },
    centerFraction: { type: "number", minimum: 0, maximum: 1 },
    referenceEyeHeight: { type: "number" },
  },
  required: [
    "plinthHeight",
    "sculptureHeight",
    "centerFraction",
    "referenceEyeHeight",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { centerHeight: { type: "number" }, eyeGap: { type: "number" } },
  required: ["centerHeight", "eyeGap"],
} as const;
/** Calculate sculpture plinth center height gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plinthHeight, sculptureHeight, centerFraction, referenceEyeHeight } =
    request;
  const compute = (): Output => {
    H.domain(plinthHeight >= 0 && sculptureHeight >= 0);
    H.probability(centerFraction);
    return {
      centerHeight: plinthHeight + sculptureHeight * centerFraction,
      eyeGap:
        plinthHeight + sculptureHeight * centerFraction - referenceEyeHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    plinthHeight: 1,
    sculptureHeight: 2,
    centerFraction: 0.5,
    referenceEyeHeight: 1.6,
  },
  output: { centerHeight: 2, eyeGap: 0.3999999999999999 },
} satisfies ToolExample<Input, Output>;
export const sculpturePlinthCenterHeightGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/sculpture-plinth-center-height-gap",
    title: "Sculpture Plinth Center Height Gap Tool",
    description:
      "Calculate sculpture plinth center height gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plinthHeight: { type: "number", minimum: 0 },
        sculptureHeight: { type: "number", minimum: 0 },
        centerFraction: { type: "number", minimum: 0, maximum: 1 },
        referenceEyeHeight: { type: "number" },
      },
      required: [
        "plinthHeight",
        "sculptureHeight",
        "centerFraction",
        "referenceEyeHeight",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        centerHeight: { type: "number" },
        eyeGap: { type: "number" },
      },
      required: ["centerHeight", "eyeGap"],
    },
    ports: {
      inputs: [
        {
          id: "plinthHeight",
          label: "Plinth Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sculptureHeight",
          label: "Sculpture Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "centerFraction",
          label: "Center Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "referenceEyeHeight",
          label: "Reference Eye Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "centerHeight",
          label: "Center Height",
          valueType: { type: "number" },
        },
        { id: "eyeGap", label: "Eye Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sculpturePlinthCenterHeightGapTool.execute;
export default sculpturePlinthCenterHeightGapTool;
