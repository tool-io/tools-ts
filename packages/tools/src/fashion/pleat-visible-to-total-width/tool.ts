import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visibleWidth: number;
  readonly underfoldWidth: number;
  readonly pleatCount: number;
};
export type Output = {
  readonly totalFabricWidth: number;
  readonly hiddenWidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visibleWidth: { type: "number", minimum: 0 },
    underfoldWidth: { type: "number", minimum: 0 },
    pleatCount: { type: "integer", minimum: 0 },
  },
  required: ["visibleWidth", "underfoldWidth", "pleatCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalFabricWidth: { type: "number" },
    hiddenWidth: { type: "number" },
  },
  required: ["totalFabricWidth", "hiddenWidth"],
} as const;
/** Add the caller-defined total hidden underfold width per pleat to a visible panel width; no particular pleat style is assumed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visibleWidth, underfoldWidth, pleatCount } = request;
  const compute = (): Output => {
    H.domain(visibleWidth >= 0 && underfoldWidth >= 0, "visibleWidth");
    (H.domain(
      Number.isSafeInteger(pleatCount) &&
        pleatCount >= 0 &&
        pleatCount <= Number.MAX_SAFE_INTEGER,
      "pleatCount",
    ),
      pleatCount);
    return {
      totalFabricWidth: visibleWidth + underfoldWidth * pleatCount,
      hiddenWidth: underfoldWidth * pleatCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { visibleWidth: 60, underfoldWidth: 4, pleatCount: 10 },
  output: { totalFabricWidth: 100, hiddenWidth: 40 },
} satisfies ToolExample<Input, Output>;
export const pleatVisibleToTotalWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/pleat-visible-to-total-width",
    title: "Pleat Visible To Total Width Tool",
    description:
      "Add the caller-defined total hidden underfold width per pleat to a visible panel width; no particular pleat style is assumed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visibleWidth: { type: "number", minimum: 0 },
        underfoldWidth: { type: "number", minimum: 0 },
        pleatCount: { type: "integer", minimum: 0 },
      },
      required: ["visibleWidth", "underfoldWidth", "pleatCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalFabricWidth: { type: "number" },
        hiddenWidth: { type: "number" },
      },
      required: ["totalFabricWidth", "hiddenWidth"],
    },
    ports: {
      inputs: [
        {
          id: "visibleWidth",
          label: "Visible Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "underfoldWidth",
          label: "Underfold Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pleatCount",
          label: "Pleat Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "totalFabricWidth",
          label: "Total Fabric Width",
          valueType: { type: "number" },
        },
        {
          id: "hiddenWidth",
          label: "Hidden Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pleatVisibleToTotalWidthTool.execute;
export default pleatVisibleToTotalWidthTool;
