import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly draws: readonly number[];
  readonly observation: number;
  readonly sampleSize: number;
};
export type Output = { readonly multiplicity: number; readonly weight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    draws: { type: "array", maxItems: 256, items: { type: "integer" } },
    observation: { type: "integer", minimum: 0 },
    sampleSize: { type: "integer", minimum: 1 },
  },
  required: ["draws", "observation", "sampleSize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { multiplicity: { type: "integer" }, weight: { type: "number" } },
  required: ["multiplicity", "weight"],
} as const;
/** Calculate bootstrap one draw multiplicity term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { draws, observation, sampleSize } = request;
  const compute = (): Output => {
    H.integer(sampleSize, 1);
    H.integer(observation, 0, sampleSize - 1);
    H.domain(draws.every((x) => x >= 0 && x < sampleSize));
    const multiplicity = draws.filter((x) => x === observation).length;
    return {
      multiplicity,
      weight: draws.length === 0 ? 0 : multiplicity / draws.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { draws: [0, 1, 1, 2], observation: 1, sampleSize: 3 },
  output: { multiplicity: 2, weight: 0.5 },
} satisfies ToolExample<Input, Output>;
export const bootstrapOneDrawMultiplicityTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/bootstrap-one-draw-multiplicity-term",
    title: "Bootstrap One Draw Multiplicity Term Tool",
    description:
      "Calculate bootstrap one draw multiplicity term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        draws: { type: "array", maxItems: 256, items: { type: "integer" } },
        observation: { type: "integer", minimum: 0 },
        sampleSize: { type: "integer", minimum: 1 },
      },
      required: ["draws", "observation", "sampleSize"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        multiplicity: { type: "integer" },
        weight: { type: "number" },
      },
      required: ["multiplicity", "weight"],
    },
    ports: {
      inputs: [
        {
          id: "draws",
          label: "Draws",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "observation",
          label: "Observation",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sampleSize",
          label: "Sample Size",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "multiplicity",
          label: "Multiplicity",
          valueType: { type: "integer" },
        },
        { id: "weight", label: "Weight", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = bootstrapOneDrawMultiplicityTermTool.execute;
export default bootstrapOneDrawMultiplicityTermTool;
