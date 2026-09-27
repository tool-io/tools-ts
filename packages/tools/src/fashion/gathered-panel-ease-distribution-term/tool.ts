import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly panelLength: number;
  readonly targetLength: number;
  readonly sectionTarget: number;
};
export type Output = {
  readonly sectionPanel: number;
  readonly sectionEase: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    panelLength: { type: "number" },
    targetLength: { type: "number", exclusiveMinimum: 0 },
    sectionTarget: { type: "number", minimum: 0 },
  },
  required: ["panelLength", "targetLength", "sectionTarget"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sectionPanel: { type: "number" },
    sectionEase: { type: "number" },
  },
  required: ["sectionPanel", "sectionEase"],
} as const;
/** Calculate gathered panel ease distribution term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { panelLength, targetLength, sectionTarget } = request;
  const compute = (): Output => {
    H.positive(targetLength);
    H.domain(
      panelLength >= targetLength &&
        sectionTarget >= 0 &&
        sectionTarget <= targetLength,
    );
    return {
      sectionPanel: (panelLength * sectionTarget) / targetLength,
      sectionEase:
        ((panelLength - targetLength) * sectionTarget) / targetLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { panelLength: 150, targetLength: 100, sectionTarget: 20 },
  output: { sectionPanel: 30, sectionEase: 10 },
} satisfies ToolExample<Input, Output>;
export const gatheredPanelEaseDistributionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/gathered-panel-ease-distribution-term",
    title: "Gathered Panel Ease Distribution Term Tool",
    description:
      "Calculate gathered panel ease distribution term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        panelLength: { type: "number" },
        targetLength: { type: "number", exclusiveMinimum: 0 },
        sectionTarget: { type: "number", minimum: 0 },
      },
      required: ["panelLength", "targetLength", "sectionTarget"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sectionPanel: { type: "number" },
        sectionEase: { type: "number" },
      },
      required: ["sectionPanel", "sectionEase"],
    },
    ports: {
      inputs: [
        {
          id: "panelLength",
          label: "Panel Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetLength",
          label: "Target Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sectionTarget",
          label: "Section Target",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sectionPanel",
          label: "Section Panel",
          valueType: { type: "number" },
        },
        {
          id: "sectionEase",
          label: "Section Ease",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gatheredPanelEaseDistributionTermTool.execute;
export default gatheredPanelEaseDistributionTermTool;
