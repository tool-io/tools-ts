import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ribbonIndex: number;
  readonly sectionsPerRibbon: number;
  readonly position: number;
  readonly originSection: number;
};
export type Output = { readonly sectionIndex: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ribbonIndex: { type: "integer", minimum: 0 },
    sectionsPerRibbon: { type: "integer", minimum: 1 },
    position: { type: "integer", minimum: 0 },
    originSection: { type: "integer", minimum: 0 },
  },
  required: ["ribbonIndex", "sectionsPerRibbon", "position", "originSection"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sectionIndex: { type: "integer" } },
  required: ["sectionIndex"],
} as const;
/** Zero-based ribbon and within-ribbon positions mapped to an explicitly numbered first section. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ribbonIndex, sectionsPerRibbon, position, originSection } = request;
  const compute = (): Output => {
    H.integer(ribbonIndex, 0);
    H.integer(sectionsPerRibbon, 1);
    H.integer(position, 0, sectionsPerRibbon - 1);
    H.integer(originSection, 0);
    return {
      sectionIndex: originSection + ribbonIndex * sectionsPerRibbon + position,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    ribbonIndex: 2,
    sectionsPerRibbon: 10,
    position: 3,
    originSection: 1,
  },
  output: { sectionIndex: 24 },
} satisfies ToolExample<Input, Output>;
export const microtomeRibbonSectionIndexTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/microtome-ribbon-section-index-term",
    title: "Microtome Ribbon Section Index Term Tool",
    description:
      "Zero-based ribbon and within-ribbon positions mapped to an explicitly numbered first section.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ribbonIndex: { type: "integer", minimum: 0 },
        sectionsPerRibbon: { type: "integer", minimum: 1 },
        position: { type: "integer", minimum: 0 },
        originSection: { type: "integer", minimum: 0 },
      },
      required: [
        "ribbonIndex",
        "sectionsPerRibbon",
        "position",
        "originSection",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sectionIndex: { type: "integer" } },
      required: ["sectionIndex"],
    },
    ports: {
      inputs: [
        {
          id: "ribbonIndex",
          label: "Ribbon Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sectionsPerRibbon",
          label: "Sections Per Ribbon",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "position",
          label: "Position",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "originSection",
          label: "Origin Section",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "sectionIndex",
          label: "Section Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = microtomeRibbonSectionIndexTermTool.execute;
export default microtomeRibbonSectionIndexTermTool;
