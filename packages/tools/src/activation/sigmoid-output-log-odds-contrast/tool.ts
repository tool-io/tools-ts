import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstOutput: number;
  readonly secondOutput: number;
};
export type Output = { readonly logOddsContrast: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstOutput: { type: "number", exclusiveMinimum: 0, exclusiveMaximum: 1 },
    secondOutput: { type: "number", exclusiveMinimum: 0, exclusiveMaximum: 1 },
  },
  required: ["firstOutput", "secondOutput"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { logOddsContrast: { type: "number" } },
  required: ["logOddsContrast"],
} as const;
/** Subtract first from second log odds for two explicit interior sigmoid outputs without clipping endpoints. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstOutput, secondOutput } = request;
  const compute = (): Output => {
    H.domain(firstOutput > 0 && firstOutput < 1, "firstOutput");
    H.domain(secondOutput > 0 && secondOutput < 1, "secondOutput");
    return {
      logOddsContrast:
        Math.log(secondOutput) -
        Math.log1p(-secondOutput) -
        (Math.log(firstOutput) - Math.log1p(-firstOutput)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstOutput: 0.2, secondOutput: 0.8 },
  output: { logOddsContrast: 2.7725887222397816 },
} satisfies ToolExample<Input, Output>;
export const sigmoidOutputLogOddsContrastTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["ai", "learn"],
      fields: ["activation", "activation functions", "computer science"],
      keywords: ["activation functions", "computer science"],
    },
    id: "activation/sigmoid-output-log-odds-contrast",
    title: "Sigmoid Output Log Odds Contrast",
    description:
      "Subtract first from second log odds for two explicit interior sigmoid outputs without clipping endpoints.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstOutput: {
          type: "number",
          exclusiveMinimum: 0,
          exclusiveMaximum: 1,
        },
        secondOutput: {
          type: "number",
          exclusiveMinimum: 0,
          exclusiveMaximum: 1,
        },
      },
      required: ["firstOutput", "secondOutput"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { logOddsContrast: { type: "number" } },
      required: ["logOddsContrast"],
    },
    ports: {
      inputs: [
        {
          id: "firstOutput",
          label: "First Output",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondOutput",
          label: "Second Output",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "logOddsContrast",
          label: "Log Odds Contrast",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sigmoidOutputLogOddsContrastTool.execute;
export default sigmoidOutputLogOddsContrastTool;
