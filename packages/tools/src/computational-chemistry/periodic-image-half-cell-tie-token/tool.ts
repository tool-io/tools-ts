import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly displacement: number;
  readonly cellLength: number;
  readonly tiePolicy: string;
};
export type Output = {
  readonly nearestDisplacement: number;
  readonly tied: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    displacement: { type: "number" },
    cellLength: { type: "number", exclusiveMinimum: 0 },
    tiePolicy: {
      type: "string",
      maxLength: 8192,
      enum: ["positive", "negative"],
    },
  },
  required: ["displacement", "cellLength", "tiePolicy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nearestDisplacement: { type: "number" },
    tied: { type: "boolean" },
  },
  required: ["nearestDisplacement", "tied"],
} as const;
/** One-dimensional minimum-image displacement under an explicit exact-half-cell convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { displacement, cellLength, tiePolicy } = request;
  const compute = (): Output => {
    H.positive(cellLength);
    H.domain(["positive", "negative"].includes(tiePolicy));
    let r = displacement % cellLength;
    if (r < 0) r += cellLength;
    const tied = r === cellLength / 2;
    return {
      nearestDisplacement: tied
        ? tiePolicy === "positive"
          ? r
          : -r
        : r > cellLength / 2
          ? r - cellLength
          : r,
      tied,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { displacement: 5, cellLength: 10, tiePolicy: "negative" },
  output: { nearestDisplacement: -5, tied: true },
} satisfies ToolExample<Input, Output>;
export const periodicImageHalfCellTieTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-chemistry/periodic-image-half-cell-tie-token",
    title: "Periodic Image Half Cell Tie Token Tool",
    description:
      "One-dimensional minimum-image displacement under an explicit exact-half-cell convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        displacement: { type: "number" },
        cellLength: { type: "number", exclusiveMinimum: 0 },
        tiePolicy: {
          type: "string",
          maxLength: 8192,
          enum: ["positive", "negative"],
        },
      },
      required: ["displacement", "cellLength", "tiePolicy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nearestDisplacement: { type: "number" },
        tied: { type: "boolean" },
      },
      required: ["nearestDisplacement", "tied"],
    },
    ports: {
      inputs: [
        {
          id: "displacement",
          label: "Displacement",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cellLength",
          label: "Cell Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tiePolicy",
          label: "Tie Policy",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "nearestDisplacement",
          label: "Nearest Displacement",
          valueType: { type: "number" },
        },
        { id: "tied", label: "Tied", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = periodicImageHalfCellTieTokenTool.execute;
export default periodicImageHalfCellTieTokenTool;
