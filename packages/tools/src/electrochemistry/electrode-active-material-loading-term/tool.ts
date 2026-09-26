import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coatingMass: number;
  readonly activeFraction: number;
  readonly area: number;
};
export type Output = { readonly activeMass: number; readonly loading: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coatingMass: { type: "number", minimum: 0 },
    activeFraction: { type: "number", minimum: 0, maximum: 1 },
    area: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["coatingMass", "activeFraction", "area"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { activeMass: { type: "number" }, loading: { type: "number" } },
  required: ["activeMass", "loading"],
} as const;
/** Calculate electrode active material loading term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coatingMass, activeFraction, area } = request;
  const compute = (): Output => {
    H.domain(coatingMass >= 0);
    H.probability(activeFraction);
    H.positive(area);
    return {
      activeMass: coatingMass * activeFraction,
      loading: (coatingMass * activeFraction) / area,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coatingMass: 12, activeFraction: 0.8, area: 4 },
  output: { activeMass: 9.600000000000001, loading: 2.4000000000000004 },
} satisfies ToolExample<Input, Output>;
export const electrodeActiveMaterialLoadingTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electrochemistry/electrode-active-material-loading-term",
    title: "Electrode Active Material Loading Term Tool",
    description:
      "Calculate electrode active material loading term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coatingMass: { type: "number", minimum: 0 },
        activeFraction: { type: "number", minimum: 0, maximum: 1 },
        area: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["coatingMass", "activeFraction", "area"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activeMass: { type: "number" },
        loading: { type: "number" },
      },
      required: ["activeMass", "loading"],
    },
    ports: {
      inputs: [
        {
          id: "coatingMass",
          label: "Coating Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "activeFraction",
          label: "Active Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "activeMass",
          label: "Active Mass",
          valueType: { type: "number" },
        },
        { id: "loading", label: "Loading", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = electrodeActiveMaterialLoadingTermTool.execute;
export default electrodeActiveMaterialLoadingTermTool;
