import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tabWidth: number;
  readonly tabOverlap: number;
  readonly tabs: number;
  readonly effectiveFraction: number;
};
export type Output = {
  readonly grossContactArea: number;
  readonly effectiveContactArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tabWidth: { type: "number", minimum: 0 },
    tabOverlap: { type: "number", minimum: 0 },
    tabs: { type: "integer", minimum: 0 },
    effectiveFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["tabWidth", "tabOverlap", "tabs", "effectiveFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossContactArea: { type: "number" },
    effectiveContactArea: { type: "number" },
  },
  required: ["grossContactArea", "effectiveContactArea"],
} as const;
/** Calculate mounting tab adhesive contact area from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tabWidth, tabOverlap, tabs, effectiveFraction } = request;
  const compute = (): Output => {
    H.domain(tabWidth >= 0 && tabOverlap >= 0);
    H.integer(tabs, 0);
    H.probability(effectiveFraction);
    return {
      grossContactArea: tabWidth * tabOverlap * tabs,
      effectiveContactArea: tabWidth * tabOverlap * tabs * effectiveFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tabWidth: 2, tabOverlap: 3, tabs: 4, effectiveFraction: 0.75 },
  output: { grossContactArea: 24, effectiveContactArea: 18 },
} satisfies ToolExample<Input, Output>;
export const mountingTabAdhesiveContactAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-conservation/mounting-tab-adhesive-contact-area",
    title: "Mounting Tab Adhesive Contact Area Tool",
    description:
      "Calculate mounting tab adhesive contact area from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tabWidth: { type: "number", minimum: 0 },
        tabOverlap: { type: "number", minimum: 0 },
        tabs: { type: "integer", minimum: 0 },
        effectiveFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["tabWidth", "tabOverlap", "tabs", "effectiveFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossContactArea: { type: "number" },
        effectiveContactArea: { type: "number" },
      },
      required: ["grossContactArea", "effectiveContactArea"],
    },
    ports: {
      inputs: [
        {
          id: "tabWidth",
          label: "Tab Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tabOverlap",
          label: "Tab Overlap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tabs",
          label: "Tabs",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "effectiveFraction",
          label: "Effective Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossContactArea",
          label: "Gross Contact Area",
          valueType: { type: "number" },
        },
        {
          id: "effectiveContactArea",
          label: "Effective Contact Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mountingTabAdhesiveContactAreaTool.execute;
export default mountingTabAdhesiveContactAreaTool;
