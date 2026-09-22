import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerEdge: number;
  readonly upperEdge: number;
  readonly lowerExcluded: number;
  readonly upperExcluded: number;
};
export type Output = {
  readonly nominalWidth: number;
  readonly includedWidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerEdge: { type: "number" },
    upperEdge: { type: "number" },
    lowerExcluded: { type: "number", minimum: 0 },
    upperExcluded: { type: "number", minimum: 0 },
  },
  required: ["lowerEdge", "upperEdge", "lowerExcluded", "upperExcluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalWidth: { type: "number" },
    includedWidth: { type: "number" },
  },
  required: ["nominalWidth", "includedWidth"],
} as const;
/** Spectral interval width after explicitly supplied edge exclusions, not a photolysis-rate model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lowerEdge, upperEdge, lowerExcluded, upperExcluded } = request;
  const compute = (): Output => {
    H.domain(
      upperEdge > lowerEdge &&
        lowerExcluded >= 0 &&
        upperExcluded >= 0 &&
        lowerExcluded + upperExcluded <= upperEdge - lowerEdge,
    );
    return {
      nominalWidth: upperEdge - lowerEdge,
      includedWidth: upperEdge - lowerEdge - lowerExcluded - upperExcluded,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lowerEdge: 300,
    upperEdge: 400,
    lowerExcluded: 5,
    upperExcluded: 10,
  },
  output: { nominalWidth: 100, includedWidth: 85 },
} satisfies ToolExample<Input, Output>;
export const photolysisBandEdgeWidthTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-chemistry/photolysis-band-edge-width-term",
    title: "Photolysis Band Edge Width Term Tool",
    description:
      "Spectral interval width after explicitly supplied edge exclusions, not a photolysis-rate model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerEdge: { type: "number" },
        upperEdge: { type: "number" },
        lowerExcluded: { type: "number", minimum: 0 },
        upperExcluded: { type: "number", minimum: 0 },
      },
      required: ["lowerEdge", "upperEdge", "lowerExcluded", "upperExcluded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalWidth: { type: "number" },
        includedWidth: { type: "number" },
      },
      required: ["nominalWidth", "includedWidth"],
    },
    ports: {
      inputs: [
        {
          id: "lowerEdge",
          label: "Lower Edge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperEdge",
          label: "Upper Edge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerExcluded",
          label: "Lower Excluded",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperExcluded",
          label: "Upper Excluded",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nominalWidth",
          label: "Nominal Width",
          valueType: { type: "number" },
        },
        {
          id: "includedWidth",
          label: "Included Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = photolysisBandEdgeWidthTermTool.execute;
export default photolysisBandEdgeWidthTermTool;
