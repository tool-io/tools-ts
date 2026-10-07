import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flux: number;
  readonly lowerBound: number;
  readonly upperBound: number;
};
export type Output = {
  readonly lowerSlack: number;
  readonly upperSlack: number;
  readonly feasible: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flux: { type: "number" },
    lowerBound: { type: "number" },
    upperBound: { type: "number" },
  },
  required: ["flux", "lowerBound", "upperBound"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerSlack: { type: "number" },
    upperSlack: { type: "number" },
    feasible: { type: "boolean" },
  },
  required: ["lowerSlack", "upperSlack", "feasible"],
} as const;
/** Report signed flux slack to explicit inclusive metabolic bounds without solving an optimization problem. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flux, lowerBound, upperBound } = request;
  const compute = (): Output => {
    H.domain(upperBound >= lowerBound, "upperBound");
    return {
      lowerSlack: flux - lowerBound,
      upperSlack: upperBound - flux,
      feasible: flux >= lowerBound && flux <= upperBound,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flux: 3, lowerBound: 0, upperBound: 10 },
  output: { lowerSlack: 3, upperSlack: 7, feasible: true },
} satisfies ToolExample<Input, Output>;
export const metabolicBoundFluxSlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["computational-biology", "computational biology", "biology"],
      keywords: ["computational biology", "biology"],
    },
    id: "computational-biology/metabolic-bound-flux-slack",
    title: "Metabolic Bound Flux Slack",
    description:
      "Report signed flux slack to explicit inclusive metabolic bounds without solving an optimization problem.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flux: { type: "number" },
        lowerBound: { type: "number" },
        upperBound: { type: "number" },
      },
      required: ["flux", "lowerBound", "upperBound"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerSlack: { type: "number" },
        upperSlack: { type: "number" },
        feasible: { type: "boolean" },
      },
      required: ["lowerSlack", "upperSlack", "feasible"],
    },
    ports: {
      inputs: [
        {
          id: "flux",
          label: "Flux",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerBound",
          label: "Lower Bound",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperBound",
          label: "Upper Bound",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lowerSlack",
          label: "Lower Slack",
          valueType: { type: "number" },
        },
        {
          id: "upperSlack",
          label: "Upper Slack",
          valueType: { type: "number" },
        },
        { id: "feasible", label: "Feasible", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = metabolicBoundFluxSlackTool.execute;
export default metabolicBoundFluxSlackTool;
