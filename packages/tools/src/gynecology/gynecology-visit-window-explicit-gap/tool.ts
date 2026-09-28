import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actualDay: number;
  readonly lowerDay: number;
  readonly upperDay: number;
};
export type Output = {
  readonly lowerSlack: number;
  readonly upperSlack: number;
  readonly signedOutsideDistance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualDay: { type: "integer" },
    lowerDay: { type: "integer" },
    upperDay: { type: "integer" },
  },
  required: ["actualDay", "lowerDay", "upperDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerSlack: { type: "integer" },
    upperSlack: { type: "integer" },
    signedOutsideDistance: { type: "integer" },
  },
  required: ["lowerSlack", "upperSlack", "signedOutsideDistance"],
} as const;
/** Report scalar research-window slack under supplied bounds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actualDay, lowerDay, upperDay } = request;
  const compute = (): Output => {
    H.domain(upperDay >= lowerDay);
    return {
      lowerSlack: actualDay - lowerDay,
      upperSlack: upperDay - actualDay,
      signedOutsideDistance:
        actualDay < lowerDay
          ? actualDay - lowerDay
          : actualDay > upperDay
            ? actualDay - upperDay
            : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { actualDay: 105, lowerDay: 100, upperDay: 110 },
  output: { lowerSlack: 5, upperSlack: 5, signedOutsideDistance: 0 },
} satisfies ToolExample<Input, Output>;
export const gynecologyVisitWindowExplicitGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gynecology/gynecology-visit-window-explicit-gap",
    title: "Gynecology Visit Window Explicit Gap Tool",
    description: "Report scalar research-window slack under supplied bounds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualDay: { type: "integer" },
        lowerDay: { type: "integer" },
        upperDay: { type: "integer" },
      },
      required: ["actualDay", "lowerDay", "upperDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerSlack: { type: "integer" },
        upperSlack: { type: "integer" },
        signedOutsideDistance: { type: "integer" },
      },
      required: ["lowerSlack", "upperSlack", "signedOutsideDistance"],
    },
    ports: {
      inputs: [
        {
          id: "actualDay",
          label: "Actual Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lowerDay",
          label: "Lower Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "upperDay",
          label: "Upper Day",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "lowerSlack",
          label: "Lower Slack",
          valueType: { type: "integer" },
        },
        {
          id: "upperSlack",
          label: "Upper Slack",
          valueType: { type: "integer" },
        },
        {
          id: "signedOutsideDistance",
          label: "Signed Outside Distance",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = gynecologyVisitWindowExplicitGapTool.execute;
export default gynecologyVisitWindowExplicitGapTool;
