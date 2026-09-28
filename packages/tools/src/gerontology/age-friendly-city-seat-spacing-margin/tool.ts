import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly routeLength: number;
  readonly restStopPositions: readonly number[];
  readonly maximumGap: number;
};
export type Output = {
  readonly largestGap: number;
  readonly margin: number;
  readonly withinRule: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    routeLength: { type: "number" },
    restStopPositions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    maximumGap: { type: "number" },
  },
  required: ["routeLength", "restStopPositions", "maximumGap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    largestGap: { type: "number" },
    margin: { type: "number" },
    withinRule: { type: "boolean" },
  },
  required: ["largestGap", "margin", "withinRule"],
} as const;
/** Longest along-route gap including endpoints, using a caller-defined rest-stop spacing criterion; accessibility is not certified. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { routeLength, restStopPositions, maximumGap } = request;
  const compute = (): Output => {
    H.domain(
      routeLength >= 0 &&
        maximumGap >= 0 &&
        restStopPositions.every(
          (v, i) =>
            v >= 0 &&
            v <= routeLength &&
            (i === 0 || v >= restStopPositions[i - 1]),
        ),
    );
    return {
      largestGap: Math.max(
        ...[0, ...restStopPositions, routeLength]
          .slice(1)
          .map((v, i) => v - [0, ...restStopPositions, routeLength][i]),
      ),
      margin:
        maximumGap -
        Math.max(
          ...[0, ...restStopPositions, routeLength]
            .slice(1)
            .map((v, i) => v - [0, ...restStopPositions, routeLength][i]),
        ),
      withinRule:
        Math.max(
          ...[0, ...restStopPositions, routeLength]
            .slice(1)
            .map((v, i) => v - [0, ...restStopPositions, routeLength][i]),
        ) <= maximumGap,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { routeLength: 100, restStopPositions: [20, 50, 80], maximumGap: 35 },
  output: { largestGap: 30, margin: 5, withinRule: true },
} satisfies ToolExample<Input, Output>;
export const ageFriendlyCitySeatSpacingMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gerontology/age-friendly-city-seat-spacing-margin",
    title: "Age Friendly City Seat Spacing Margin Tool",
    description:
      "Longest along-route gap including endpoints, using a caller-defined rest-stop spacing criterion; accessibility is not certified.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        routeLength: { type: "number" },
        restStopPositions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        maximumGap: { type: "number" },
      },
      required: ["routeLength", "restStopPositions", "maximumGap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        largestGap: { type: "number" },
        margin: { type: "number" },
        withinRule: { type: "boolean" },
      },
      required: ["largestGap", "margin", "withinRule"],
    },
    ports: {
      inputs: [
        {
          id: "routeLength",
          label: "Route Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "restStopPositions",
          label: "Rest Stop Positions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "maximumGap",
          label: "Maximum Gap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "largestGap",
          label: "Largest Gap",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        {
          id: "withinRule",
          label: "Within Rule",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = ageFriendlyCitySeatSpacingMarginTool.execute;
export default ageFriendlyCitySeatSpacingMarginTool;
