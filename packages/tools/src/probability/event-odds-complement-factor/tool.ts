import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly probability: number };
export type Output = {
  readonly eventOdds: number;
  readonly complementOdds: number;
  readonly product: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probability: { type: "number", exclusiveMinimum: 0, exclusiveMaximum: 1 },
  },
  required: ["probability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventOdds: { type: "number" },
    complementOdds: { type: "number" },
    product: { type: "number" },
  },
  required: ["eventOdds", "complementOdds", "product"],
} as const;
/** Calculate event odds complement factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { probability } = request;
  const compute = (): Output => {
    H.domain(probability > 0 && probability < 1);
    return {
      eventOdds: probability / (1 - probability),
      complementOdds: (1 - probability) / probability,
      product: 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { probability: 0.25 },
  output: { eventOdds: 0.3333333333333333, complementOdds: 3, product: 1 },
} satisfies ToolExample<Input, Output>;
export const eventOddsComplementFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "probability/event-odds-complement-factor",
    title: "Event Odds Complement Factor Tool",
    description:
      "Calculate event odds complement factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probability: {
          type: "number",
          exclusiveMinimum: 0,
          exclusiveMaximum: 1,
        },
      },
      required: ["probability"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventOdds: { type: "number" },
        complementOdds: { type: "number" },
        product: { type: "number" },
      },
      required: ["eventOdds", "complementOdds", "product"],
    },
    ports: {
      inputs: [
        {
          id: "probability",
          label: "Probability",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "eventOdds", label: "Event Odds", valueType: { type: "number" } },
        {
          id: "complementOdds",
          label: "Complement Odds",
          valueType: { type: "number" },
        },
        { id: "product", label: "Product", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = eventOddsComplementFactorTool.execute;
export default eventOddsComplementFactorTool;
