import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstOffset: number;
  readonly secondOffset: number;
  readonly firstHeight: number;
  readonly secondHeight: number;
};
export type Output = { readonly signedPanelArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstOffset: { type: "number" },
    secondOffset: { type: "number" },
    firstHeight: { type: "number" },
    secondHeight: { type: "number" },
  },
  required: ["firstOffset", "secondOffset", "firstHeight", "secondHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedPanelArea: { type: "number" } },
  required: ["signedPanelArea"],
} as const;
/** Integrate one linear beach-profile panel relative to an explicit vertical zero using signed trapezoidal area. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstOffset, secondOffset, firstHeight, secondHeight } = request;
  const compute = (): Output => {
    H.domain(secondOffset >= firstOffset, "secondOffset");
    return {
      signedPanelArea:
        (secondOffset - firstOffset) * (firstHeight / 2 + secondHeight / 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstOffset: 0, secondOffset: 4, firstHeight: 2, secondHeight: 3 },
  output: { signedPanelArea: 10 },
} satisfies ToolExample<Input, Output>;
export const beachCrossSectionPanelAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geomorphology", "earth and environmental sciences"],
      keywords: ["geomorphology", "earth and environmental sciences"],
    },
    id: "geomorphology/beach-cross-section-panel-area",
    title: "Beach Cross Section Panel Area",
    description:
      "Integrate one linear beach-profile panel relative to an explicit vertical zero using signed trapezoidal area.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstOffset: { type: "number" },
        secondOffset: { type: "number" },
        firstHeight: { type: "number" },
        secondHeight: { type: "number" },
      },
      required: ["firstOffset", "secondOffset", "firstHeight", "secondHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedPanelArea: { type: "number" } },
      required: ["signedPanelArea"],
    },
    ports: {
      inputs: [
        {
          id: "firstOffset",
          label: "First Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondOffset",
          label: "Second Offset",
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
      ],
      outputs: [
        {
          id: "signedPanelArea",
          label: "Signed Panel Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = beachCrossSectionPanelAreaTool.execute;
export default beachCrossSectionPanelAreaTool;
