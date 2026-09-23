import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventTime: number;
  readonly start: number;
  readonly end: number;
  readonly includeEnd: boolean;
};
export type Output = { readonly included: boolean; readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventTime: { type: "number" },
    start: { type: "number" },
    end: { type: "number" },
    includeEnd: { type: "boolean" },
  },
  required: ["eventTime", "start", "end", "includeEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { included: { type: "boolean" }, offset: { type: "number" } },
  required: ["included", "offset"],
} as const;
/** Calculate active user period boundary pair from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventTime, start, end, includeEnd } = request;
  const compute = (): Output => {
    H.domain(end >= start);
    return {
      included:
        eventTime >= start && (includeEnd ? eventTime <= end : eventTime < end),
      offset: eventTime - start,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventTime: 20, start: 10, end: 20, includeEnd: false },
  output: { included: false, offset: 10 },
} satisfies ToolExample<Input, Output>;
export const activeUserPeriodBoundaryPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-analytics/active-user-period-boundary-pair",
    title: "Active User Period Boundary Pair Tool",
    description:
      "Calculate active user period boundary pair from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventTime: { type: "number" },
        start: { type: "number" },
        end: { type: "number" },
        includeEnd: { type: "boolean" },
      },
      required: ["eventTime", "start", "end", "includeEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { included: { type: "boolean" }, offset: { type: "number" } },
      required: ["included", "offset"],
    },
    ports: {
      inputs: [
        {
          id: "eventTime",
          label: "Event Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "start",
          label: "Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "end",
          label: "End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeEnd",
          label: "Include End",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "included", label: "Included", valueType: { type: "boolean" } },
        { id: "offset", label: "Offset", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = activeUserPeriodBoundaryPairTool.execute;
export default activeUserPeriodBoundaryPairTool;
