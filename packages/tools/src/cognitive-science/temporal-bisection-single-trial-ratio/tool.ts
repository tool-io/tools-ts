import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly probeDuration: number;
  readonly shortAnchor: number;
  readonly longAnchor: number;
};
export type Output = { readonly anchorPosition: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probeDuration: { type: "number", minimum: 0 },
    shortAnchor: { type: "number", minimum: 0 },
    longAnchor: { type: "number" },
  },
  required: ["probeDuration", "shortAnchor", "longAnchor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { anchorPosition: { type: "number" } },
  required: ["anchorPosition"],
} as const;
/** Express a supplied temporal-bisection probe relative to explicit short and long anchors without clipping extrapolated values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { probeDuration, shortAnchor, longAnchor } = request;
  const compute = (): Output => {
    H.domain(probeDuration >= 0, "probeDuration");
    H.domain(shortAnchor >= 0, "shortAnchor");
    H.domain(longAnchor > shortAnchor, "longAnchor");
    return {
      anchorPosition:
        (probeDuration - shortAnchor) / (longAnchor - shortAnchor),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { probeDuration: 4, shortAnchor: 2, longAnchor: 10 },
  output: { anchorPosition: 0.25 },
} satisfies ToolExample<Input, Output>;
export const temporalBisectionSingleTrialRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["cognitive-science", "cognitive science", "psychology"],
      keywords: ["cognitive science", "psychology"],
    },
    id: "cognitive-science/temporal-bisection-single-trial-ratio",
    title: "Temporal Bisection Single Trial Ratio",
    description:
      "Express a supplied temporal-bisection probe relative to explicit short and long anchors without clipping extrapolated values.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probeDuration: { type: "number", minimum: 0 },
        shortAnchor: { type: "number", minimum: 0 },
        longAnchor: { type: "number" },
      },
      required: ["probeDuration", "shortAnchor", "longAnchor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { anchorPosition: { type: "number" } },
      required: ["anchorPosition"],
    },
    ports: {
      inputs: [
        {
          id: "probeDuration",
          label: "Probe Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shortAnchor",
          label: "Short Anchor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "longAnchor",
          label: "Long Anchor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "anchorPosition",
          label: "Anchor Position",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = temporalBisectionSingleTrialRatioTool.execute;
export default temporalBisectionSingleTrialRatioTool;
