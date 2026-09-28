import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly targetPopulation: number;
  readonly totalPopulation: number;
};
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetPopulation: { type: "integer", minimum: 0 },
    totalPopulation: { type: "integer", minimum: 0 },
  },
  required: ["targetPopulation", "totalPopulation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Calculate service target population share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { targetPopulation, totalPopulation } = request;
  const compute = (): Output => {
    H.integer(totalPopulation, 0);
    H.integer(targetPopulation, 0, totalPopulation);
    return {
      share: totalPopulation > 0 ? targetPopulation / totalPopulation : 0,
      defined: totalPopulation > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { targetPopulation: 20, totalPopulation: 100 },
  output: { share: 0.2, defined: true },
} satisfies ToolExample<Input, Output>;
export const serviceTargetPopulationShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-policy/service-target-population-share",
    title: "Service Target Population Share Tool",
    description:
      "Calculate service target population share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetPopulation: { type: "integer", minimum: 0 },
        totalPopulation: { type: "integer", minimum: 0 },
      },
      required: ["targetPopulation", "totalPopulation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" }, defined: { type: "boolean" } },
      required: ["share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "targetPopulation",
          label: "Target Population",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalPopulation",
          label: "Total Population",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = serviceTargetPopulationShareTool.execute;
export default serviceTargetPopulationShareTool;
