import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly panelWidth: number;
  readonly panelHeight: number;
  readonly gap: number;
};
export type Output = {
  readonly openingWidth: number;
  readonly openingHeight: number;
  readonly revealArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    panelWidth: { type: "number", minimum: 0 },
    panelHeight: { type: "number", minimum: 0 },
    gap: { type: "number", minimum: 0 },
  },
  required: ["panelWidth", "panelHeight", "gap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingWidth: { type: "number" },
    openingHeight: { type: "number" },
    revealArea: { type: "number" },
  },
  required: ["openingWidth", "openingHeight", "revealArea"],
} as const;
/** Calculate acoustic panel edge shadow gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { panelWidth, panelHeight, gap } = request;
  const compute = (): Output => {
    H.domain(panelWidth >= 0 && panelHeight >= 0 && gap >= 0);
    return {
      openingWidth: panelWidth + 2 * gap,
      openingHeight: panelHeight + 2 * gap,
      revealArea: 2 * gap * (panelWidth + panelHeight) + 4 * gap * gap,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { panelWidth: 1, panelHeight: 2, gap: 0.01 },
  output: {
    openingWidth: 1.02,
    openingHeight: 2.02,
    revealArea: 0.060399999999999995,
  },
} satisfies ToolExample<Input, Output>;
export const acousticPanelEdgeShadowGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/acoustic-panel-edge-shadow-gap",
    title: "Acoustic Panel Edge Shadow Gap Tool",
    description:
      "Calculate acoustic panel edge shadow gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        panelWidth: { type: "number", minimum: 0 },
        panelHeight: { type: "number", minimum: 0 },
        gap: { type: "number", minimum: 0 },
      },
      required: ["panelWidth", "panelHeight", "gap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingWidth: { type: "number" },
        openingHeight: { type: "number" },
        revealArea: { type: "number" },
      },
      required: ["openingWidth", "openingHeight", "revealArea"],
    },
    ports: {
      inputs: [
        {
          id: "panelWidth",
          label: "Panel Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "panelHeight",
          label: "Panel Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gap",
          label: "Gap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "openingWidth",
          label: "Opening Width",
          valueType: { type: "number" },
        },
        {
          id: "openingHeight",
          label: "Opening Height",
          valueType: { type: "number" },
        },
        {
          id: "revealArea",
          label: "Reveal Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = acousticPanelEdgeShadowGapTool.execute;
export default acousticPanelEdgeShadowGapTool;
