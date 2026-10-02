import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visible: readonly boolean[];
  readonly included: readonly boolean[];
};
export type Output = {
  readonly visibleIncluded: number;
  readonly includedCount: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visible: { type: "array", maxItems: 256, items: { type: "boolean" } },
    included: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["visible", "included"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visibleIncluded: { type: "integer" },
    includedCount: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["visibleIncluded", "includedCount", "share", "defined"],
} as const;
/** Audit supplied research visibility flags without periodontal disease assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visible, included } = request;
  const compute = (): Output => {
    H.sameLength(visible, included);
    return {
      visibleIncluded: visible.filter((x, i) => x && included[i]).length,
      includedCount: included.filter(Boolean).length,
      share: included.some(Boolean)
        ? visible.filter((x, i) => x && included[i]).length /
          included.filter(Boolean).length
        : 0,
      defined: included.some(Boolean),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { visible: [true, false], included: [true, true] },
  output: { visibleIncluded: 1, includedCount: 2, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const periodontalSiteVisibleShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "periodontology/periodontal-site-visible-share",
    title: "Periodontal Site Visible Share Tool",
    description:
      "Audit supplied research visibility flags without periodontal disease assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visible: { type: "array", maxItems: 256, items: { type: "boolean" } },
        included: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["visible", "included"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visibleIncluded: { type: "integer" },
        includedCount: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["visibleIncluded", "includedCount", "share", "defined"],
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
          id: "included",
          label: "Included",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "visibleIncluded",
          label: "Visible Included",
          valueType: { type: "integer" },
        },
        {
          id: "includedCount",
          label: "Included Count",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = periodontalSiteVisibleShareTool.execute;
export default periodontalSiteVisibleShareTool;
