import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stiffness: number;
  readonly preload: number;
  readonly displacement: number;
};
export type Output = {
  readonly crossTerm: number;
  readonly incrementalEnergy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stiffness: { type: "number", minimum: 0 },
    preload: { type: "number" },
    displacement: { type: "number" },
  },
  required: ["stiffness", "preload", "displacement"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    crossTerm: { type: "number" },
    incrementalEnergy: { type: "number" },
  },
  required: ["crossTerm", "incrementalEnergy"],
} as const;
/** Energy change from a preloaded ideal linear spring, retaining the signed preload cross term. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stiffness, preload, displacement } = request;
  const compute = (): Output => {
    H.domain(stiffness >= 0);
    return {
      crossTerm: stiffness * preload * displacement,
      incrementalEnergy:
        stiffness * preload * displacement +
        (stiffness * displacement ** 2) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stiffness: 2, preload: 3, displacement: 4 },
  output: { crossTerm: 24, incrementalEnergy: 40 },
} satisfies ToolExample<Input, Output>;
export const springEnergyPreloadCrossTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/spring-energy-preload-cross-term",
    title: "Spring Energy Preload Cross Term Tool",
    description:
      "Energy change from a preloaded ideal linear spring, retaining the signed preload cross term.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stiffness: { type: "number", minimum: 0 },
        preload: { type: "number" },
        displacement: { type: "number" },
      },
      required: ["stiffness", "preload", "displacement"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        crossTerm: { type: "number" },
        incrementalEnergy: { type: "number" },
      },
      required: ["crossTerm", "incrementalEnergy"],
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
          id: "preload",
          label: "Preload",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "displacement",
          label: "Displacement",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "crossTerm", label: "Cross Term", valueType: { type: "number" } },
        {
          id: "incrementalEnergy",
          label: "Incremental Energy",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = springEnergyPreloadCrossTermTool.execute;
export default springEnergyPreloadCrossTermTool;
