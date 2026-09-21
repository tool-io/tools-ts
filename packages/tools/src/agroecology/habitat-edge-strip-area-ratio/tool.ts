import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly edgeLengths: readonly number[];
  readonly stripWidths: readonly number[];
  readonly nonoverlapVerified: boolean;
  readonly plotArea: number;
};
export type Output = { readonly stripArea: number; readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    edgeLengths: { type: "array", maxItems: 256, items: { type: "number" } },
    stripWidths: { type: "array", maxItems: 256, items: { type: "number" } },
    nonoverlapVerified: { type: "boolean" },
    plotArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["edgeLengths", "stripWidths", "nonoverlapVerified", "plotArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { stripArea: { type: "number" }, ratio: { type: "number" } },
  required: ["stripArea", "ratio"],
} as const;
/** Calculate habitat edge strip area ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { edgeLengths, stripWidths, nonoverlapVerified, plotArea } = request;
  const compute = (): Output => {
    H.sameLength(edgeLengths, stripWidths);
    H.domain(
      nonoverlapVerified,
      "nonoverlapVerified",
      "Verify that supplied rectangular strips do not overlap.",
    );
    H.domain([...edgeLengths, ...stripWidths].every((x) => x >= 0));
    H.positive(plotArea);
    return (() => {
      const stripArea = edgeLengths.reduce(
        (s, x, i) => s + x * stripWidths[i],
        0,
      );
      H.domain(stripArea <= plotArea);
      return { stripArea, ratio: stripArea / plotArea };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    edgeLengths: [10, 20],
    stripWidths: [1, 2],
    nonoverlapVerified: true,
    plotArea: 100,
  },
  output: { stripArea: 50, ratio: 0.5 },
} satisfies ToolExample<Input, Output>;
export const habitatEdgeStripAreaRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroecology/habitat-edge-strip-area-ratio",
    title: "Habitat Edge Strip Area Ratio Tool",
    description:
      "Calculate habitat edge strip area ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        edgeLengths: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        stripWidths: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        nonoverlapVerified: { type: "boolean" },
        plotArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "edgeLengths",
        "stripWidths",
        "nonoverlapVerified",
        "plotArea",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { stripArea: { type: "number" }, ratio: { type: "number" } },
      required: ["stripArea", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "edgeLengths",
          label: "Edge Lengths",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "stripWidths",
          label: "Strip Widths",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "nonoverlapVerified",
          label: "Nonoverlap Verified",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "plotArea",
          label: "Plot Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "stripArea", label: "Strip Area", valueType: { type: "number" } },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = habitatEdgeStripAreaRatioTool.execute;
export default habitatEdgeStripAreaRatioTool;
