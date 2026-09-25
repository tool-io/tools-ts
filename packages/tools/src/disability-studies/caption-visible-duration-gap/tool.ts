import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visibleDuration: number;
  readonly requiredDuration: number;
};
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visibleDuration: { type: "number", minimum: 0 },
    requiredDuration: { type: "number", minimum: 0 },
  },
  required: ["visibleDuration", "requiredDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" } },
  required: ["gap"],
} as const;
/** Compare measured caption visibility to an explicit requirement without selecting an accessibility standard. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visibleDuration, requiredDuration } = request;
  const compute = (): Output => {
    H.domain(visibleDuration >= 0 && requiredDuration >= 0);
    return { gap: visibleDuration - requiredDuration };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { visibleDuration: 4, requiredDuration: 3 },
  output: { gap: 1 },
} satisfies ToolExample<Input, Output>;
export const captionVisibleDurationGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "disability-studies/caption-visible-duration-gap",
    title: "Caption Visible Duration Gap Tool",
    description:
      "Compare measured caption visibility to an explicit requirement without selecting an accessibility standard.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visibleDuration: { type: "number", minimum: 0 },
        requiredDuration: { type: "number", minimum: 0 },
      },
      required: ["visibleDuration", "requiredDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" } },
      required: ["gap"],
    },
    ports: {
      inputs: [
        {
          id: "visibleDuration",
          label: "Visible Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredDuration",
          label: "Required Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "gap", label: "Gap", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = captionVisibleDurationGapTool.execute;
export default captionVisibleDurationGapTool;
