import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentration: number;
  readonly flow: number;
  readonly duration: number;
  readonly unitFactor: number;
};
export type Output = { readonly load: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentration: { type: "number", minimum: 0 },
    flow: { type: "number", minimum: 0 },
    duration: { type: "number", minimum: 0 },
    unitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["concentration", "flow", "duration", "unitFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { load: { type: "number" } },
  required: ["load"],
} as const;
/** Calculate pollutant load concentration flow term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentration, flow, duration, unitFactor } = request;
  const compute = (): Output => {
    H.domain(concentration >= 0 && flow >= 0 && duration >= 0);
    H.positive(unitFactor);
    return { load: concentration * flow * duration * unitFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { concentration: 2, flow: 3, duration: 4, unitFactor: 1 },
  output: { load: 24 },
} satisfies ToolExample<Input, Output>;
export const pollutantLoadConcentrationFlowTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/pollutant-load-concentration-flow-term",
    title: "Pollutant Load Concentration Flow Term Tool",
    description:
      "Calculate pollutant load concentration flow term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concentration: { type: "number", minimum: 0 },
        flow: { type: "number", minimum: 0 },
        duration: { type: "number", minimum: 0 },
        unitFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["concentration", "flow", "duration", "unitFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { load: { type: "number" } },
      required: ["load"],
    },
    ports: {
      inputs: [
        {
          id: "concentration",
          label: "Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "flow",
          label: "Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "duration",
          label: "Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitFactor",
          label: "Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "load", label: "Load", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = pollutantLoadConcentrationFlowTermTool.execute;
export default pollutantLoadConcentrationFlowTermTool;
