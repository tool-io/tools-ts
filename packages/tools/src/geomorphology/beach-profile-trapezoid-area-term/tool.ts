import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDistance: number;
  readonly secondDistance: number;
  readonly firstHeight: number;
  readonly secondHeight: number;
  readonly referenceHeight: number;
};
export type Output = { readonly width: number; readonly signedArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDistance: { type: "number" },
    secondDistance: { type: "number" },
    firstHeight: { type: "number" },
    secondHeight: { type: "number" },
    referenceHeight: { type: "number" },
  },
  required: [
    "firstDistance",
    "secondDistance",
    "firstHeight",
    "secondHeight",
    "referenceHeight",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { width: { type: "number" }, signedArea: { type: "number" } },
  required: ["width", "signedArea"],
} as const;
/** Signed cross-sectional trapezoid area above an explicit elevation reference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstDistance,
    secondDistance,
    firstHeight,
    secondHeight,
    referenceHeight,
  } = request;
  const compute = (): Output => {
    H.domain(secondDistance >= firstDistance);
    return {
      width: secondDistance - firstDistance,
      signedArea:
        ((secondDistance - firstDistance) *
          (firstHeight + secondHeight - 2 * referenceHeight)) /
        2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstDistance: 0,
    secondDistance: 10,
    firstHeight: 3,
    secondHeight: 1,
    referenceHeight: 0,
  },
  output: { width: 10, signedArea: 20 },
} satisfies ToolExample<Input, Output>;
export const beachProfileTrapezoidAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/beach-profile-trapezoid-area-term",
    title: "Beach Profile Trapezoid Area Term Tool",
    description:
      "Signed cross-sectional trapezoid area above an explicit elevation reference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDistance: { type: "number" },
        secondDistance: { type: "number" },
        firstHeight: { type: "number" },
        secondHeight: { type: "number" },
        referenceHeight: { type: "number" },
      },
      required: [
        "firstDistance",
        "secondDistance",
        "firstHeight",
        "secondHeight",
        "referenceHeight",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { width: { type: "number" }, signedArea: { type: "number" } },
      required: ["width", "signedArea"],
    },
    ports: {
      inputs: [
        {
          id: "firstDistance",
          label: "First Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDistance",
          label: "Second Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstHeight",
          label: "First Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondHeight",
          label: "Second Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceHeight",
          label: "Reference Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "width", label: "Width", valueType: { type: "number" } },
        {
          id: "signedArea",
          label: "Signed Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = beachProfileTrapezoidAreaTermTool.execute;
export default beachProfileTrapezoidAreaTermTool;
