import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visible: readonly boolean[];
  readonly assessable: readonly boolean[];
};
export type Output = {
  readonly visibleAssessable: number;
  readonly hiddenAssessable: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visible: { type: "array", maxItems: 256, items: { type: "boolean" } },
    assessable: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["visible", "assessable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visibleAssessable: { type: "integer" },
    hiddenAssessable: { type: "integer" },
  },
  required: ["visibleAssessable", "hiddenAssessable"],
} as const;
/** Count caller-annotated research surface visibility without a clinical assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visible, assessable } = request;
  const compute = (): Output => {
    H.sameLength(visible, assessable);
    return {
      visibleAssessable: visible.filter((x, i) => x && assessable[i]).length,
      hiddenAssessable: visible.filter((x, i) => !x && assessable[i]).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { visible: [true, false, true], assessable: [true, true, false] },
  output: { visibleAssessable: 1, hiddenAssessable: 1 },
} satisfies ToolExample<Input, Output>;
export const oralSurfaceVisibleCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dental-hygiene/oral-surface-visible-count",
    title: "Oral Surface Visible Count Tool",
    description:
      "Count caller-annotated research surface visibility without a clinical assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visible: { type: "array", maxItems: 256, items: { type: "boolean" } },
        assessable: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["visible", "assessable"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visibleAssessable: { type: "integer" },
        hiddenAssessable: { type: "integer" },
      },
      required: ["visibleAssessable", "hiddenAssessable"],
    },
    ports: {
      inputs: [
        {
          id: "visible",
          label: "Visible",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "assessable",
          label: "Assessable",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "visibleAssessable",
          label: "Visible Assessable",
          valueType: { type: "integer" },
        },
        {
          id: "hiddenAssessable",
          label: "Hidden Assessable",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = oralSurfaceVisibleCountTool.execute;
export default oralSurfaceVisibleCountTool;
