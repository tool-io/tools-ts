import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly affinity: number };
export type Output = { readonly distance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { affinity: { type: "number", exclusiveMinimum: 0, maximum: 1 } },
  required: ["affinity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distance: { type: "number" } },
  required: ["distance"],
} as const;
/** Calculate bhattacharyya log affinity term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { affinity } = request;
  const compute = (): Output => {
    H.domain(affinity > 0 && affinity <= 1);
    return { distance: -Math.log(affinity) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { affinity: 0.5 },
  output: { distance: 0.6931471805599453 },
} satisfies ToolExample<Input, Output>;
export const bhattacharyyaLogAffinityTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information/bhattacharyya-log-affinity-term",
    title: "Bhattacharyya Log Affinity Term Tool",
    description:
      "Calculate bhattacharyya log affinity term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        affinity: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["affinity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { distance: { type: "number" } },
      required: ["distance"],
    },
    ports: {
      inputs: [
        {
          id: "affinity",
          label: "Affinity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "distance", label: "Distance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = bhattacharyyaLogAffinityTermTool.execute;
export default bhattacharyyaLogAffinityTermTool;
