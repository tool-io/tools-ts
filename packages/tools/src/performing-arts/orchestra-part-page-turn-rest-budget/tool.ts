import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly restBeats: number;
  readonly tempo: number;
  readonly requiredSeconds: number;
};
export type Output = {
  readonly restSeconds: number;
  readonly marginSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    restBeats: { type: "number", minimum: 0 },
    tempo: { type: "number", exclusiveMinimum: 0 },
    requiredSeconds: { type: "number", minimum: 0 },
  },
  required: ["restBeats", "tempo", "requiredSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    restSeconds: { type: "number" },
    marginSeconds: { type: "number" },
  },
  required: ["restSeconds", "marginSeconds"],
} as const;
/** Calculate orchestra part page turn rest budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { restBeats, tempo, requiredSeconds } = request;
  const compute = (): Output => {
    H.domain(restBeats >= 0 && requiredSeconds >= 0);
    H.positive(tempo);
    return {
      restSeconds: (60 * restBeats) / tempo,
      marginSeconds: (60 * restBeats) / tempo - requiredSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { restBeats: 8, tempo: 120, requiredSeconds: 3 },
  output: { restSeconds: 4, marginSeconds: 1 },
} satisfies ToolExample<Input, Output>;
export const orchestraPartPageTurnRestBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/orchestra-part-page-turn-rest-budget",
    title: "Orchestra Part Page Turn Rest Budget Tool",
    description:
      "Calculate orchestra part page turn rest budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        restBeats: { type: "number", minimum: 0 },
        tempo: { type: "number", exclusiveMinimum: 0 },
        requiredSeconds: { type: "number", minimum: 0 },
      },
      required: ["restBeats", "tempo", "requiredSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        restSeconds: { type: "number" },
        marginSeconds: { type: "number" },
      },
      required: ["restSeconds", "marginSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "restBeats",
          label: "Rest Beats",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tempo",
          label: "Tempo",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredSeconds",
          label: "Required Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "restSeconds",
          label: "Rest Seconds",
          valueType: { type: "number" },
        },
        {
          id: "marginSeconds",
          label: "Margin Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = orchestraPartPageTurnRestBudgetTool.execute;
export default orchestraPartPageTurnRestBudgetTool;
