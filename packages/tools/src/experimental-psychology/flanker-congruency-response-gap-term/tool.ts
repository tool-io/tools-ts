import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly congruentMean: number;
  readonly incongruentMean: number;
  readonly neutralMean: number;
};
export type Output = {
  readonly interference: number;
  readonly facilitation: number;
  readonly totalCongruencyEffect: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    congruentMean: { type: "number", minimum: 0 },
    incongruentMean: { type: "number", minimum: 0 },
    neutralMean: { type: "number", minimum: 0 },
  },
  required: ["congruentMean", "incongruentMean", "neutralMean"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    interference: { type: "number" },
    facilitation: { type: "number" },
    totalCongruencyEffect: { type: "number" },
  },
  required: ["interference", "facilitation", "totalCongruencyEffect"],
} as const;
/** Calculate flanker congruency response gap term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { congruentMean, incongruentMean, neutralMean } = request;
  const compute = (): Output => {
    H.domain(congruentMean >= 0 && incongruentMean >= 0 && neutralMean >= 0);
    return {
      interference: incongruentMean - neutralMean,
      facilitation: neutralMean - congruentMean,
      totalCongruencyEffect: incongruentMean - congruentMean,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { congruentMean: 400, incongruentMean: 480, neutralMean: 440 },
  output: { interference: 40, facilitation: 40, totalCongruencyEffect: 80 },
} satisfies ToolExample<Input, Output>;
export const flankerCongruencyResponseGapTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/flanker-congruency-response-gap-term",
    title: "Flanker Congruency Response Gap Term Tool",
    description:
      "Calculate flanker congruency response gap term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        congruentMean: { type: "number", minimum: 0 },
        incongruentMean: { type: "number", minimum: 0 },
        neutralMean: { type: "number", minimum: 0 },
      },
      required: ["congruentMean", "incongruentMean", "neutralMean"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        interference: { type: "number" },
        facilitation: { type: "number" },
        totalCongruencyEffect: { type: "number" },
      },
      required: ["interference", "facilitation", "totalCongruencyEffect"],
    },
    ports: {
      inputs: [
        {
          id: "congruentMean",
          label: "Congruent Mean",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "incongruentMean",
          label: "Incongruent Mean",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "neutralMean",
          label: "Neutral Mean",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "interference",
          label: "Interference",
          valueType: { type: "number" },
        },
        {
          id: "facilitation",
          label: "Facilitation",
          valueType: { type: "number" },
        },
        {
          id: "totalCongruencyEffect",
          label: "Total Congruency Effect",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = flankerCongruencyResponseGapTermTool.execute;
export default flankerCongruencyResponseGapTermTool;
