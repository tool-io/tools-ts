import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly panelHeight: number;
  readonly spandrelHeight: number;
};
export type Output = {
  readonly spandrelFraction: number;
  readonly visionHeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    panelHeight: { type: "number", exclusiveMinimum: 0 },
    spandrelHeight: { type: "number", minimum: 0 },
  },
  required: ["panelHeight", "spandrelHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spandrelFraction: { type: "number" },
    visionHeight: { type: "number" },
  },
  required: ["spandrelFraction", "visionHeight"],
} as const;
/** Calculate curtain wall panel spandrel share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { panelHeight, spandrelHeight } = request;
  const compute = (): Output => {
    H.positive(panelHeight);
    H.domain(spandrelHeight >= 0 && spandrelHeight <= panelHeight);
    return {
      spandrelFraction: spandrelHeight / panelHeight,
      visionHeight: panelHeight - spandrelHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { panelHeight: 4, spandrelHeight: 1 },
  output: { spandrelFraction: 0.25, visionHeight: 3 },
} satisfies ToolExample<Input, Output>;
export const curtainWallPanelSpandrelShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/curtain-wall-panel-spandrel-share",
    title: "Curtain Wall Panel Spandrel Share Tool",
    description:
      "Calculate curtain wall panel spandrel share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        panelHeight: { type: "number", exclusiveMinimum: 0 },
        spandrelHeight: { type: "number", minimum: 0 },
      },
      required: ["panelHeight", "spandrelHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spandrelFraction: { type: "number" },
        visionHeight: { type: "number" },
      },
      required: ["spandrelFraction", "visionHeight"],
    },
    ports: {
      inputs: [
        {
          id: "panelHeight",
          label: "Panel Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spandrelHeight",
          label: "Spandrel Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "spandrelFraction",
          label: "Spandrel Fraction",
          valueType: { type: "number" },
        },
        {
          id: "visionHeight",
          label: "Vision Height",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = curtainWallPanelSpandrelShareTool.execute;
export default curtainWallPanelSpandrelShareTool;
