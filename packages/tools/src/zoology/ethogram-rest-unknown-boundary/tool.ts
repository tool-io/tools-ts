import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly restSeconds: number;
  readonly activeSeconds: number;
  readonly unknownSeconds: number;
  readonly unknownCountsAsRest: boolean;
};
export type Output = {
  readonly restShare: number;
  readonly unresolvedShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    restSeconds: { type: "number", minimum: 0 },
    activeSeconds: { type: "number", minimum: 0 },
    unknownSeconds: { type: "number", minimum: 0 },
    unknownCountsAsRest: { type: "boolean" },
  },
  required: [
    "restSeconds",
    "activeSeconds",
    "unknownSeconds",
    "unknownCountsAsRest",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    restShare: { type: "number" },
    unresolvedShare: { type: "number" },
  },
  required: ["restShare", "unresolvedShare"],
} as const;
/** Show the explicit unknown-as-rest coding scenario while retaining unresolved observation share. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { restSeconds, activeSeconds, unknownSeconds, unknownCountsAsRest } =
    request;
  const compute = (): Output => {
    H.domain(
      restSeconds >= 0 &&
        activeSeconds >= 0 &&
        unknownSeconds >= 0 &&
        restSeconds + activeSeconds + unknownSeconds > 0,
    );
    return {
      restShare:
        (restSeconds + (unknownCountsAsRest ? unknownSeconds : 0)) /
        (restSeconds + activeSeconds + unknownSeconds),
      unresolvedShare:
        unknownSeconds / (restSeconds + activeSeconds + unknownSeconds),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    restSeconds: 30,
    activeSeconds: 60,
    unknownSeconds: 10,
    unknownCountsAsRest: false,
  },
  output: { restShare: 0.3, unresolvedShare: 0.1 },
} satisfies ToolExample<Input, Output>;
export const ethogramRestUnknownBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/ethogram-rest-unknown-boundary",
    title: "Ethogram Rest Unknown Boundary Tool",
    description:
      "Show the explicit unknown-as-rest coding scenario while retaining unresolved observation share.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        restSeconds: { type: "number", minimum: 0 },
        activeSeconds: { type: "number", minimum: 0 },
        unknownSeconds: { type: "number", minimum: 0 },
        unknownCountsAsRest: { type: "boolean" },
      },
      required: [
        "restSeconds",
        "activeSeconds",
        "unknownSeconds",
        "unknownCountsAsRest",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        restShare: { type: "number" },
        unresolvedShare: { type: "number" },
      },
      required: ["restShare", "unresolvedShare"],
    },
    ports: {
      inputs: [
        {
          id: "restSeconds",
          label: "Rest Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "activeSeconds",
          label: "Active Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unknownSeconds",
          label: "Unknown Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unknownCountsAsRest",
          label: "Unknown Counts As Rest",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "restShare", label: "Rest Share", valueType: { type: "number" } },
        {
          id: "unresolvedShare",
          label: "Unresolved Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ethogramRestUnknownBoundaryTool.execute;
export default ethogramRestUnknownBoundaryTool;
