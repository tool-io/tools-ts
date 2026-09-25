import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly demonstrationEnd: number;
  readonly responseStart: number;
  readonly interveningActivitySeconds: number;
};
export type Output = {
  readonly elapsedSeconds: number;
  readonly unoccupiedDelaySeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    demonstrationEnd: { type: "number" },
    responseStart: { type: "number" },
    interveningActivitySeconds: { type: "number", minimum: 0 },
  },
  required: ["demonstrationEnd", "responseStart", "interveningActivitySeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedSeconds: { type: "number" },
    unoccupiedDelaySeconds: { type: "number" },
  },
  required: ["elapsedSeconds", "unoccupiedDelaySeconds"],
} as const;
/** Calculate imitation task demonstration delay term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { demonstrationEnd, responseStart, interveningActivitySeconds } =
    request;
  const compute = (): Output => {
    H.domain(
      responseStart >= demonstrationEnd &&
        interveningActivitySeconds >= 0 &&
        interveningActivitySeconds <= responseStart - demonstrationEnd,
    );
    return {
      elapsedSeconds: responseStart - demonstrationEnd,
      unoccupiedDelaySeconds:
        responseStart - demonstrationEnd - interveningActivitySeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    demonstrationEnd: 20,
    responseStart: 80,
    interveningActivitySeconds: 15,
  },
  output: { elapsedSeconds: 60, unoccupiedDelaySeconds: 45 },
} satisfies ToolExample<Input, Output>;
export const imitationTaskDemonstrationDelayTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "developmental-psychology/imitation-task-demonstration-delay-term",
      title: "Imitation Task Demonstration Delay Term Tool",
      description:
        "Calculate imitation task demonstration delay term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          demonstrationEnd: { type: "number" },
          responseStart: { type: "number" },
          interveningActivitySeconds: { type: "number", minimum: 0 },
        },
        required: [
          "demonstrationEnd",
          "responseStart",
          "interveningActivitySeconds",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          elapsedSeconds: { type: "number" },
          unoccupiedDelaySeconds: { type: "number" },
        },
        required: ["elapsedSeconds", "unoccupiedDelaySeconds"],
      },
      ports: {
        inputs: [
          {
            id: "demonstrationEnd",
            label: "Demonstration End",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "responseStart",
            label: "Response Start",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "interveningActivitySeconds",
            label: "Intervening Activity Seconds",
            required: true,
            valueType: { type: "number", unit: "s" },
          },
        ],
        outputs: [
          {
            id: "elapsedSeconds",
            label: "Elapsed Seconds",
            valueType: { type: "number", unit: "s" },
          },
          {
            id: "unoccupiedDelaySeconds",
            label: "Unoccupied Delay Seconds",
            valueType: { type: "number", unit: "s" },
          },
        ],
      },
    },
    calculate,
  });
export const run = imitationTaskDemonstrationDelayTermTool.execute;
export default imitationTaskDemonstrationDelayTermTool;
