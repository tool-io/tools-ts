import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPanelLength: number;
  readonly secondPanelLength: number;
  readonly suppliedOverlap: number;
};
export type Output = { readonly combinedVisibleLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPanelLength: { type: "number", minimum: 0 },
    secondPanelLength: { type: "number", minimum: 0 },
    suppliedOverlap: { type: "number", minimum: 0 },
  },
  required: ["firstPanelLength", "secondPanelLength", "suppliedOverlap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { combinedVisibleLength: { type: "number" } },
  required: ["combinedVisibleLength"],
} as const;
/** Calculate explicit two-panel union length under a supplied overlap without aligning or registering images. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPanelLength, secondPanelLength, suppliedOverlap } = request;
  const compute = (): Output => {
    H.domain(
      firstPanelLength >= 0 &&
        secondPanelLength >= 0 &&
        suppliedOverlap >= 0 &&
        suppliedOverlap <= Math.min(firstPanelLength, secondPanelLength),
      "firstPanelLength",
    );
    return {
      combinedVisibleLength:
        firstPanelLength + secondPanelLength - suppliedOverlap,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstPanelLength: 100, secondPanelLength: 80, suppliedOverlap: 10 },
  output: { combinedVisibleLength: 170 },
} satisfies ToolExample<Input, Output>;
export const muralPanelRegistrationOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["visual-arts", "visual arts", "arts and design"],
      keywords: ["visual arts", "arts and design"],
    },
    id: "visual-arts/mural-panel-registration-overlap",
    title: "Mural Panel Registration Overlap",
    description:
      "Calculate explicit two-panel union length under a supplied overlap without aligning or registering images.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPanelLength: { type: "number", minimum: 0 },
        secondPanelLength: { type: "number", minimum: 0 },
        suppliedOverlap: { type: "number", minimum: 0 },
      },
      required: ["firstPanelLength", "secondPanelLength", "suppliedOverlap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { combinedVisibleLength: { type: "number" } },
      required: ["combinedVisibleLength"],
    },
    ports: {
      inputs: [
        {
          id: "firstPanelLength",
          label: "First Panel Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondPanelLength",
          label: "Second Panel Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedOverlap",
          label: "Supplied Overlap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "combinedVisibleLength",
          label: "Combined Visible Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = muralPanelRegistrationOverlapTool.execute;
export default muralPanelRegistrationOverlapTool;
