import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly source: string;
  readonly target: string;
  readonly vertex: string;
};
export type Output = { readonly incidence: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    source: { type: "string", maxLength: 8192 },
    target: { type: "string", maxLength: 8192 },
    vertex: { type: "string", maxLength: 8192 },
  },
  required: ["source", "target", "vertex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { incidence: { type: "integer" } },
  required: ["incidence"],
} as const;
/** Compute directed edge source target incidence sign from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { source, target, vertex } = input;
  const compute = (): Output => {
    return {
      incidence: (target === vertex ? 1 : 0) - (source === vertex ? 1 : 0),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { source: "a", target: "b", vertex: "a" },
  output: { incidence: -1 },
} satisfies ToolExample<Input, Output>;
export const directedEdgeSourceTargetIncidenceSignTool =
  defineSchemaCalculation<Input, Output>({
    id: "graph/directed-edge-source-target-incidence-sign",
    title: "Directed Edge Source Target Incidence Sign Tool",
    description:
      "Compute directed edge source target incidence sign from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "target",
          label: "Target",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "vertex",
          label: "Vertex",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "incidence", label: "Incidence", valueType: { type: "integer" } },
      ],
    },
  });
export const run = directedEdgeSourceTargetIncidenceSignTool.execute;
export default directedEdgeSourceTargetIncidenceSignTool;
