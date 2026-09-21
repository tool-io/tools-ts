import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly documentedHours: number;
  readonly suppliedCap: number;
  readonly previouslyRecognized: number;
};
export type Output = {
  readonly eligibleAdditional: number;
  readonly unrecognized: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    documentedHours: { type: "number", minimum: 0 },
    suppliedCap: { type: "number", minimum: 0 },
    previouslyRecognized: { type: "number", minimum: 0 },
  },
  required: ["documentedHours", "suppliedCap", "previouslyRecognized"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleAdditional: { type: "number" },
    unrecognized: { type: "number" },
  },
  required: ["eligibleAdditional", "unrecognized"],
} as const;
/** Calculate prior learning hour cap residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { documentedHours, suppliedCap, previouslyRecognized } = request;
  const compute = (): Output => {
    H.domain(
      documentedHours >= 0 && suppliedCap >= 0 && previouslyRecognized >= 0,
    );
    return {
      eligibleAdditional: Math.min(
        documentedHours,
        Math.max(0, suppliedCap - previouslyRecognized),
      ),
      unrecognized:
        documentedHours -
        Math.min(
          documentedHours,
          Math.max(0, suppliedCap - previouslyRecognized),
        ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { documentedHours: 80, suppliedCap: 100, previouslyRecognized: 40 },
  output: { eligibleAdditional: 60, unrecognized: 20 },
} satisfies ToolExample<Input, Output>;
export const priorLearningHourCapResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "adult-education/prior-learning-hour-cap-residual",
    title: "Prior Learning Hour Cap Residual Tool",
    description:
      "Calculate prior learning hour cap residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        documentedHours: { type: "number", minimum: 0 },
        suppliedCap: { type: "number", minimum: 0 },
        previouslyRecognized: { type: "number", minimum: 0 },
      },
      required: ["documentedHours", "suppliedCap", "previouslyRecognized"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleAdditional: { type: "number" },
        unrecognized: { type: "number" },
      },
      required: ["eligibleAdditional", "unrecognized"],
    },
    ports: {
      inputs: [
        {
          id: "documentedHours",
          label: "Documented Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCap",
          label: "Supplied Cap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "previouslyRecognized",
          label: "Previously Recognized",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleAdditional",
          label: "Eligible Additional",
          valueType: { type: "number" },
        },
        {
          id: "unrecognized",
          label: "Unrecognized",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = priorLearningHourCapResidualTool.execute;
export default priorLearningHourCapResidualTool;
