import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stiffness: number;
  readonly preloadDisplacement: number;
  readonly addedDisplacement: number;
};
export type Output = {
  readonly initialEnergy: number;
  readonly finalEnergy: number;
  readonly energyChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stiffness: { type: "number", minimum: 0 },
    preloadDisplacement: { type: "number" },
    addedDisplacement: { type: "number" },
  },
  required: ["stiffness", "preloadDisplacement", "addedDisplacement"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialEnergy: { type: "number" },
    finalEnergy: { type: "number" },
    energyChange: { type: "number" },
  },
  required: ["initialEnergy", "finalEnergy", "energyChange"],
} as const;
/** Calculate bench load preload energy term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stiffness, preloadDisplacement, addedDisplacement } = request;
  const compute = (): Output => {
    H.domain(stiffness >= 0);
    return {
      initialEnergy: (stiffness * preloadDisplacement ** 2) / 2,
      finalEnergy:
        (stiffness * (preloadDisplacement + addedDisplacement) ** 2) / 2,
      energyChange:
        stiffness *
        addedDisplacement *
        (preloadDisplacement + addedDisplacement / 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stiffness: 2, preloadDisplacement: 3, addedDisplacement: 1 },
  output: { initialEnergy: 9, finalEnergy: 16, energyChange: 7 },
} satisfies ToolExample<Input, Output>;
export const benchLoadPreloadEnergyTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/bench-load-preload-energy-term",
    title: "Bench Load Preload Energy Term Tool",
    description:
      "Calculate bench load preload energy term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stiffness: { type: "number", minimum: 0 },
        preloadDisplacement: { type: "number" },
        addedDisplacement: { type: "number" },
      },
      required: ["stiffness", "preloadDisplacement", "addedDisplacement"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialEnergy: { type: "number" },
        finalEnergy: { type: "number" },
        energyChange: { type: "number" },
      },
      required: ["initialEnergy", "finalEnergy", "energyChange"],
    },
    ports: {
      inputs: [
        {
          id: "stiffness",
          label: "Stiffness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "preloadDisplacement",
          label: "Preload Displacement",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "addedDisplacement",
          label: "Added Displacement",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "initialEnergy",
          label: "Initial Energy",
          valueType: { type: "number" },
        },
        {
          id: "finalEnergy",
          label: "Final Energy",
          valueType: { type: "number" },
        },
        {
          id: "energyChange",
          label: "Energy Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = benchLoadPreloadEnergyTermTool.execute;
export default benchLoadPreloadEnergyTermTool;
