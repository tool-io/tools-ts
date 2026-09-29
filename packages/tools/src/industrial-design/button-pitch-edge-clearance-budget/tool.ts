import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pitch: number;
  readonly firstWidth: number;
  readonly secondWidth: number;
};
export type Output = { readonly edgeGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pitch: { type: "number", minimum: 0 },
    firstWidth: { type: "number", minimum: 0 },
    secondWidth: { type: "number", minimum: 0 },
  },
  required: ["pitch", "firstWidth", "secondWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { edgeGap: { type: "number" } },
  required: ["edgeGap"],
} as const;
/** Calculate button pitch edge clearance budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pitch, firstWidth, secondWidth } = request;
  const compute = (): Output => {
    H.domain(pitch >= 0 && firstWidth >= 0 && secondWidth >= 0);
    return { edgeGap: pitch - (firstWidth + secondWidth) / 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pitch: 30, firstWidth: 20, secondWidth: 18 },
  output: { edgeGap: 11 },
} satisfies ToolExample<Input, Output>;
export const buttonPitchEdgeClearanceBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/button-pitch-edge-clearance-budget",
    title: "Button Pitch Edge Clearance Budget Tool",
    description:
      "Calculate button pitch edge clearance budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pitch: { type: "number", minimum: 0 },
        firstWidth: { type: "number", minimum: 0 },
        secondWidth: { type: "number", minimum: 0 },
      },
      required: ["pitch", "firstWidth", "secondWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { edgeGap: { type: "number" } },
      required: ["edgeGap"],
    },
    ports: {
      inputs: [
        {
          id: "pitch",
          label: "Pitch",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstWidth",
          label: "First Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondWidth",
          label: "Second Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "edgeGap", label: "Edge Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = buttonPitchEdgeClearanceBudgetTool.execute;
export default buttonPitchEdgeClearanceBudgetTool;
