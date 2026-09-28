import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly components: number;
  readonly endpointsSameComponent: boolean;
};
export type Output = { readonly components: number; readonly delta: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    components: { type: "integer", minimum: 1 },
    endpointsSameComponent: { type: "boolean" },
  },
  required: ["components", "endpointsSameComponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { components: { type: "integer" }, delta: { type: "integer" } },
  required: ["components", "delta"],
} as const;
/** Calculate graph component merge count step from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { components, endpointsSameComponent } = request;
  const compute = (): Output => {
    H.integer(components, 1);
    H.domain(endpointsSameComponent || components >= 2);
    const delta = endpointsSameComponent ? 0 : -1;
    return { components: components + delta, delta };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { components: 5, endpointsSameComponent: false },
  output: { components: 4, delta: -1 },
} satisfies ToolExample<Input, Output>;
export const graphComponentMergeCountStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/graph-component-merge-count-step",
    title: "Graph Component Merge Count Step Tool",
    description:
      "Calculate graph component merge count step from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        components: { type: "integer", minimum: 1 },
        endpointsSameComponent: { type: "boolean" },
      },
      required: ["components", "endpointsSameComponent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        components: { type: "integer" },
        delta: { type: "integer" },
      },
      required: ["components", "delta"],
    },
    ports: {
      inputs: [
        {
          id: "components",
          label: "Components",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endpointsSameComponent",
          label: "Endpoints Same Component",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "components",
          label: "Components",
          valueType: { type: "integer" },
        },
        { id: "delta", label: "Delta", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = graphComponentMergeCountStepTool.execute;
export default graphComponentMergeCountStepTool;
