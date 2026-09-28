import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly directed: boolean; readonly signed: boolean };
export type Output = { readonly entry: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { directed: { type: "boolean" }, signed: { type: "boolean" } },
  required: ["directed", "signed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { entry: { type: "integer" } },
  required: ["entry"],
} as const;
/** Report the loop entry under signed directed or unsigned degree-incidence convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { directed, signed } = request;
  const compute = (): Output => {
    return { entry: directed && signed ? 0 : 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { directed: true, signed: true },
  output: { entry: 0 },
} satisfies ToolExample<Input, Output>;
export const graphSelfLoopIncidenceConventionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/graph-self-loop-incidence-convention",
    title: "Graph Self Loop Incidence Convention Tool",
    description:
      "Report the loop entry under signed directed or unsigned degree-incidence convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        directed: { type: "boolean" },
        signed: { type: "boolean" },
      },
      required: ["directed", "signed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { entry: { type: "integer" } },
      required: ["entry"],
    },
    ports: {
      inputs: [
        {
          id: "directed",
          label: "Directed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "signed",
          label: "Signed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "entry", label: "Entry", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = graphSelfLoopIncidenceConventionTool.execute;
export default graphSelfLoopIncidenceConventionTool;
