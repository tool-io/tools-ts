import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly jointPresent: number;
  readonly dimensions: number;
};
export type Output = { readonly score: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    jointPresent: { type: "integer", minimum: 0 },
    dimensions: { type: "integer", minimum: 1 },
  },
  required: ["jointPresent", "dimensions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { score: { type: "number" } },
  required: ["score"],
} as const;
/** Calculate russell rao joint presence denominator from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { jointPresent, dimensions } = request;
  const compute = (): Output => {
    H.integer(dimensions, 1);
    H.integer(jointPresent, 0, dimensions);
    return { score: jointPresent / dimensions };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { jointPresent: 3, dimensions: 10 },
  output: { score: 0.3 },
} satisfies ToolExample<Input, Output>;
export const russellRaoJointPresenceDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/russell-rao-joint-presence-denominator",
    title: "Russell Rao Joint Presence Denominator Tool",
    description:
      "Calculate russell rao joint presence denominator from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        jointPresent: { type: "integer", minimum: 0 },
        dimensions: { type: "integer", minimum: 1 },
      },
      required: ["jointPresent", "dimensions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { score: { type: "number" } },
      required: ["score"],
    },
    ports: {
      inputs: [
        {
          id: "jointPresent",
          label: "Joint Present",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "dimensions",
          label: "Dimensions",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "score", label: "Score", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = russellRaoJointPresenceDenominatorTool.execute;
export default russellRaoJointPresenceDenominatorTool;
