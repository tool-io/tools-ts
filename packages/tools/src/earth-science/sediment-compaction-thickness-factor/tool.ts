import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialThickness: number;
  readonly initialPorosity: number;
  readonly finalPorosity: number;
};
export type Output = {
  readonly thicknessFactor: number;
  readonly finalThickness: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialThickness: { type: "number", minimum: 0 },
    initialPorosity: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    finalPorosity: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["initialThickness", "initialPorosity", "finalPorosity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    thicknessFactor: { type: "number" },
    finalThickness: { type: "number" },
  },
  required: ["thicknessFactor", "finalThickness"],
} as const;
/** One-dimensional constant-solid-volume compaction at fixed plan area, excluding cementation and grain loss. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialThickness, initialPorosity, finalPorosity } = request;
  const compute = (): Output => {
    H.domain(
      initialThickness >= 0 &&
        initialPorosity >= 0 &&
        initialPorosity < 1 &&
        finalPorosity >= 0 &&
        finalPorosity < 1,
    );
    return {
      thicknessFactor: (1 - initialPorosity) / (1 - finalPorosity),
      finalThickness:
        (initialThickness * (1 - initialPorosity)) / (1 - finalPorosity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialThickness: 100, initialPorosity: 0.5, finalPorosity: 0.25 },
  output: {
    thicknessFactor: 0.6666666666666666,
    finalThickness: 66.66666666666667,
  },
} satisfies ToolExample<Input, Output>;
export const sedimentCompactionThicknessFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "earth-science/sediment-compaction-thickness-factor",
    title: "Sediment Compaction Thickness Factor Tool",
    description:
      "One-dimensional constant-solid-volume compaction at fixed plan area, excluding cementation and grain loss.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialThickness: { type: "number", minimum: 0 },
        initialPorosity: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        finalPorosity: { type: "number", minimum: 0, exclusiveMaximum: 1 },
      },
      required: ["initialThickness", "initialPorosity", "finalPorosity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        thicknessFactor: { type: "number" },
        finalThickness: { type: "number" },
      },
      required: ["thicknessFactor", "finalThickness"],
    },
    ports: {
      inputs: [
        {
          id: "initialThickness",
          label: "Initial Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "initialPorosity",
          label: "Initial Porosity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "finalPorosity",
          label: "Final Porosity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "thicknessFactor",
          label: "Thickness Factor",
          valueType: { type: "number" },
        },
        {
          id: "finalThickness",
          label: "Final Thickness",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sedimentCompactionThicknessFactorTool.execute;
export default sedimentCompactionThicknessFactorTool;
