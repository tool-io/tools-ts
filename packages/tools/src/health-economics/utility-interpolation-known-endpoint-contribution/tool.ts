import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstTime: number;
  readonly secondTime: number;
  readonly firstUtility: number;
  readonly secondUtility: number;
  readonly queryTime: number;
};
export type Output = {
  readonly firstWeight: number;
  readonly secondWeight: number;
  readonly interpolatedUtility: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTime: { type: "number" },
    secondTime: { type: "number" },
    firstUtility: { type: "number" },
    secondUtility: { type: "number" },
    queryTime: { type: "number" },
  },
  required: [
    "firstTime",
    "secondTime",
    "firstUtility",
    "secondUtility",
    "queryTime",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstWeight: { type: "number" },
    secondWeight: { type: "number" },
    interpolatedUtility: { type: "number" },
  },
  required: ["firstWeight", "secondWeight", "interpolatedUtility"],
} as const;
/** Calculate utility interpolation known endpoint contribution from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstTime, secondTime, firstUtility, secondUtility, queryTime } =
    request;
  const compute = (): Output => {
    H.domain(
      secondTime > firstTime &&
        queryTime >= firstTime &&
        queryTime <= secondTime,
    );
    return {
      firstWeight: (secondTime - queryTime) / (secondTime - firstTime),
      secondWeight: (queryTime - firstTime) / (secondTime - firstTime),
      interpolatedUtility:
        ((secondTime - queryTime) * firstUtility +
          (queryTime - firstTime) * secondUtility) /
        (secondTime - firstTime),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstTime: 0,
    secondTime: 10,
    firstUtility: 0.4,
    secondUtility: 0.8,
    queryTime: 5,
  },
  output: { firstWeight: 0.5, secondWeight: 0.5, interpolatedUtility: 0.6 },
} satisfies ToolExample<Input, Output>;
export const utilityInterpolationKnownEndpointContributionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health-economics/utility-interpolation-known-endpoint-contribution",
      title: "Utility Interpolation Known Endpoint Contribution Tool",
      description:
        "Calculate utility interpolation known endpoint contribution from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstTime: { type: "number" },
          secondTime: { type: "number" },
          firstUtility: { type: "number" },
          secondUtility: { type: "number" },
          queryTime: { type: "number" },
        },
        required: [
          "firstTime",
          "secondTime",
          "firstUtility",
          "secondUtility",
          "queryTime",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstWeight: { type: "number" },
          secondWeight: { type: "number" },
          interpolatedUtility: { type: "number" },
        },
        required: ["firstWeight", "secondWeight", "interpolatedUtility"],
      },
      ports: {
        inputs: [
          {
            id: "firstTime",
            label: "First Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondTime",
            label: "Second Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstUtility",
            label: "First Utility",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondUtility",
            label: "Second Utility",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "queryTime",
            label: "Query Time",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "firstWeight",
            label: "First Weight",
            valueType: { type: "number" },
          },
          {
            id: "secondWeight",
            label: "Second Weight",
            valueType: { type: "number" },
          },
          {
            id: "interpolatedUtility",
            label: "Interpolated Utility",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = utilityInterpolationKnownEndpointContributionTool.execute;
export default utilityInterpolationKnownEndpointContributionTool;
