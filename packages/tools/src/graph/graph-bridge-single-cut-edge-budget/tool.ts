import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly componentCount: number;
  readonly bridge: boolean;
};
export type Output = { readonly afterRemovalComponents: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    componentCount: { type: "integer", minimum: 1 },
    bridge: { type: "boolean" },
  },
  required: ["componentCount", "bridge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { afterRemovalComponents: { type: "integer" } },
  required: ["afterRemovalComponents"],
} as const;
/** Compute graph bridge single cut edge budget from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { componentCount, bridge } = input;
  const compute = (): Output => {
    integer(componentCount, 1);
    return { afterRemovalComponents: componentCount + (bridge ? 1 : 0) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { componentCount: 2, bridge: true },
  output: { afterRemovalComponents: 3 },
} satisfies ToolExample<Input, Output>;
export const graphBridgeSingleCutEdgeBudgetTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "graph/graph-bridge-single-cut-edge-budget",
  title: "Graph Bridge Single Cut Edge Budget Tool",
  description:
    "Compute graph bridge single cut edge budget from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "componentCount",
        label: "Component Count",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "bridge",
        label: "Bridge",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      {
        id: "afterRemovalComponents",
        label: "After Removal Components",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = graphBridgeSingleCutEdgeBudgetTool.execute;
export default graphBridgeSingleCutEdgeBudgetTool;
