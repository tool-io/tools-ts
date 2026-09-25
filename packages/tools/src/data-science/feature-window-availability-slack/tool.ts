import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly featureWindowEnd: number;
  readonly publicationDelay: number;
  readonly predictionAt: number;
  readonly suppliedSafetyLag: number;
};
export type Output = {
  readonly availableAt: number;
  readonly slack: number;
  readonly usableUnderInputs: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    featureWindowEnd: { type: "number" },
    publicationDelay: { type: "number", minimum: 0 },
    predictionAt: { type: "number" },
    suppliedSafetyLag: { type: "number", minimum: 0 },
  },
  required: [
    "featureWindowEnd",
    "publicationDelay",
    "predictionAt",
    "suppliedSafetyLag",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableAt: { type: "number" },
    slack: { type: "number" },
    usableUnderInputs: { type: "boolean" },
  },
  required: ["availableAt", "slack", "usableUnderInputs"],
} as const;
/** Calculate feature window availability slack from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    featureWindowEnd,
    publicationDelay,
    predictionAt,
    suppliedSafetyLag,
  } = request;
  const compute = (): Output => {
    H.domain(publicationDelay >= 0 && suppliedSafetyLag >= 0);
    return (() => {
      const availableAt = featureWindowEnd + publicationDelay,
        slack = predictionAt - availableAt - suppliedSafetyLag;
      return { availableAt, slack, usableUnderInputs: slack >= 0 };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    featureWindowEnd: 10,
    publicationDelay: 2,
    predictionAt: 15,
    suppliedSafetyLag: 1,
  },
  output: { availableAt: 12, slack: 2, usableUnderInputs: true },
} satisfies ToolExample<Input, Output>;
export const featureWindowAvailabilitySlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/feature-window-availability-slack",
    title: "Feature Window Availability Slack Tool",
    description:
      "Calculate feature window availability slack from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        featureWindowEnd: { type: "number" },
        publicationDelay: { type: "number", minimum: 0 },
        predictionAt: { type: "number" },
        suppliedSafetyLag: { type: "number", minimum: 0 },
      },
      required: [
        "featureWindowEnd",
        "publicationDelay",
        "predictionAt",
        "suppliedSafetyLag",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableAt: { type: "number" },
        slack: { type: "number" },
        usableUnderInputs: { type: "boolean" },
      },
      required: ["availableAt", "slack", "usableUnderInputs"],
    },
    ports: {
      inputs: [
        {
          id: "featureWindowEnd",
          label: "Feature Window End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "publicationDelay",
          label: "Publication Delay",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "predictionAt",
          label: "Prediction At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSafetyLag",
          label: "Supplied Safety Lag",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "availableAt",
          label: "Available At",
          valueType: { type: "number" },
        },
        { id: "slack", label: "Slack", valueType: { type: "number" } },
        {
          id: "usableUnderInputs",
          label: "Usable Under Inputs",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = featureWindowAvailabilitySlackTool.execute;
export default featureWindowAvailabilitySlackTool;
