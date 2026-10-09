import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstSourceId: string;
  readonly secondSourceId: string;
  readonly dependenceSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstSourceId: { type: "string", maxLength: 8192, minLength: 1 },
    secondSourceId: { type: "string", maxLength: 8192, minLength: 1 },
    dependenceSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["firstSourceId", "secondSourceId", "dependenceSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a supplied source pair and dependence-evidence reference without estimating independence or credibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstSourceId, secondSourceId, dependenceSource } = request;
  const compute = (): Output => {
    H.domain(firstSourceId.length > 0, "firstSourceId");
    H.domain(secondSourceId.length > 0, "secondSourceId");
    H.domain(dependenceSource.length > 0, "dependenceSource");
    return {
      token: JSON.stringify([firstSourceId, secondSourceId, dependenceSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstSourceId: "S17",
    secondSourceId: "S18",
    dependenceSource: "shared interview I4",
  },
  output: { token: '["S17","S18","shared interview I4"]' },
} satisfies ToolExample<Input, Output>;
export const testimonialDependenceSourcePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epistemology/testimonial-dependence-source-pair",
    title: "Testimonial Dependence Source Pair Tool",
    description:
      "Record a supplied source pair and dependence-evidence reference without estimating independence or credibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstSourceId: { type: "string", maxLength: 8192, minLength: 1 },
        secondSourceId: { type: "string", maxLength: 8192, minLength: 1 },
        dependenceSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["firstSourceId", "secondSourceId", "dependenceSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "firstSourceId",
          label: "First Source Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondSourceId",
          label: "Second Source Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "dependenceSource",
          label: "Dependence Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = testimonialDependenceSourcePairTool.execute;
export default testimonialDependenceSourcePairTool;
