import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceCellSize: number;
  readonly muralCellSize: number;
  readonly referenceLength: number;
};
export type Output = {
  readonly scaleFactor: number;
  readonly muralLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceCellSize: { type: "number", exclusiveMinimum: 0 },
    muralCellSize: { type: "number", exclusiveMinimum: 0 },
    referenceLength: { type: "number", minimum: 0 },
  },
  required: ["referenceCellSize", "muralCellSize", "referenceLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scaleFactor: { type: "number" },
    muralLength: { type: "number" },
  },
  required: ["scaleFactor", "muralLength"],
} as const;
/** Scale a reference length using corresponding reference and mural grid-cell sizes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceCellSize, muralCellSize, referenceLength } = request;
  const compute = (): Output => {
    (H.domain(referenceCellSize > 0, "referenceCellSize"), referenceCellSize);
    (H.domain(muralCellSize > 0, "muralCellSize"), muralCellSize);
    H.domain(referenceLength >= 0, "referenceLength");
    return {
      scaleFactor: muralCellSize / referenceCellSize,
      muralLength: (referenceLength * muralCellSize) / referenceCellSize,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceCellSize: 2, muralCellSize: 20, referenceLength: 7 },
  output: { scaleFactor: 10, muralLength: 70 },
} satisfies ToolExample<Input, Output>;
export const muralGridCellScaleTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "visual-arts/mural-grid-cell-scale",
    title: "Mural Grid Cell Scale Tool",
    description:
      "Scale a reference length using corresponding reference and mural grid-cell sizes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceCellSize: { type: "number", exclusiveMinimum: 0 },
        muralCellSize: { type: "number", exclusiveMinimum: 0 },
        referenceLength: { type: "number", minimum: 0 },
      },
      required: ["referenceCellSize", "muralCellSize", "referenceLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scaleFactor: { type: "number" },
        muralLength: { type: "number" },
      },
      required: ["scaleFactor", "muralLength"],
    },
    ports: {
      inputs: [
        {
          id: "referenceCellSize",
          label: "Reference Cell Size",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "muralCellSize",
          label: "Mural Cell Size",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceLength",
          label: "Reference Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "scaleFactor",
          label: "Scale Factor",
          valueType: { type: "number" },
        },
        {
          id: "muralLength",
          label: "Mural Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = muralGridCellScaleTool.execute;
export default muralGridCellScaleTool;
