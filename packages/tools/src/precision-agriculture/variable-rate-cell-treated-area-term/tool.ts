import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cellArea: number;
  readonly coverageFraction: number;
  readonly excludedFraction: number;
  readonly prescribedMassPerArea: number;
};
export type Output = {
  readonly treatedArea: number;
  readonly prescribedMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cellArea: { type: "number", minimum: 0 },
    coverageFraction: { type: "number", minimum: 0, maximum: 1 },
    excludedFraction: { type: "number", minimum: 0 },
    prescribedMassPerArea: { type: "number", minimum: 0 },
  },
  required: [
    "cellArea",
    "coverageFraction",
    "excludedFraction",
    "prescribedMassPerArea",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    treatedArea: { type: "number" },
    prescribedMass: { type: "number" },
  },
  required: ["treatedArea", "prescribedMass"],
} as const;
/** Integrate a supplied prescription over explicitly recorded treated area. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    cellArea,
    coverageFraction,
    excludedFraction,
    prescribedMassPerArea,
  } = request;
  const compute = (): Output => {
    H.domain(
      cellArea >= 0 &&
        coverageFraction >= 0 &&
        coverageFraction <= 1 &&
        excludedFraction >= 0 &&
        excludedFraction <= coverageFraction &&
        prescribedMassPerArea >= 0,
    );
    return {
      treatedArea: cellArea * (coverageFraction - excludedFraction),
      prescribedMass:
        cellArea *
        (coverageFraction - excludedFraction) *
        prescribedMassPerArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cellArea: 100,
    coverageFraction: 0.8,
    excludedFraction: 0.1,
    prescribedMassPerArea: 2,
  },
  output: { treatedArea: 70, prescribedMass: 140 },
} satisfies ToolExample<Input, Output>;
export const variableRateCellTreatedAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "precision-agriculture/variable-rate-cell-treated-area-term",
    title: "Variable Rate Cell Treated Area Term Tool",
    description:
      "Integrate a supplied prescription over explicitly recorded treated area.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cellArea: { type: "number", minimum: 0 },
        coverageFraction: { type: "number", minimum: 0, maximum: 1 },
        excludedFraction: { type: "number", minimum: 0 },
        prescribedMassPerArea: { type: "number", minimum: 0 },
      },
      required: [
        "cellArea",
        "coverageFraction",
        "excludedFraction",
        "prescribedMassPerArea",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        treatedArea: { type: "number" },
        prescribedMass: { type: "number" },
      },
      required: ["treatedArea", "prescribedMass"],
    },
    ports: {
      inputs: [
        {
          id: "cellArea",
          label: "Cell Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coverageFraction",
          label: "Coverage Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "excludedFraction",
          label: "Excluded Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "prescribedMassPerArea",
          label: "Prescribed Mass Per Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "treatedArea",
          label: "Treated Area",
          valueType: { type: "number" },
        },
        {
          id: "prescribedMass",
          label: "Prescribed Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = variableRateCellTreatedAreaTermTool.execute;
export default variableRateCellTreatedAreaTermTool;
