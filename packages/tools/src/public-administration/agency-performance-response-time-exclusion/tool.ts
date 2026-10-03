import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsedHours: number;
  readonly excludedHours: number;
  readonly suppliedTarget: number;
};
export type Output = {
  readonly countedHours: number;
  readonly margin: number;
  readonly within: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedHours: { type: "number" },
    excludedHours: { type: "number", minimum: 0 },
    suppliedTarget: { type: "number", minimum: 0 },
  },
  required: ["elapsedHours", "excludedHours", "suppliedTarget"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countedHours: { type: "number" },
    margin: { type: "number" },
    within: { type: "boolean" },
  },
  required: ["countedHours", "margin", "within"],
} as const;
/** Calculate agency performance response time exclusion from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsedHours, excludedHours, suppliedTarget } = request;
  const compute = (): Output => {
    H.domain(
      excludedHours >= 0 &&
        elapsedHours >= excludedHours &&
        suppliedTarget >= 0,
    );
    return {
      countedHours: elapsedHours - excludedHours,
      margin: suppliedTarget - elapsedHours + excludedHours,
      within: elapsedHours - excludedHours <= suppliedTarget,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { elapsedHours: 72, excludedHours: 24, suppliedTarget: 60 },
  output: { countedHours: 48, margin: 12, within: true },
} satisfies ToolExample<Input, Output>;
export const agencyPerformanceResponseTimeExclusionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "public-administration/agency-performance-response-time-exclusion",
      title: "Agency Performance Response Time Exclusion Tool",
      description:
        "Calculate agency performance response time exclusion from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          elapsedHours: { type: "number" },
          excludedHours: { type: "number", minimum: 0 },
          suppliedTarget: { type: "number", minimum: 0 },
        },
        required: ["elapsedHours", "excludedHours", "suppliedTarget"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          countedHours: { type: "number" },
          margin: { type: "number" },
          within: { type: "boolean" },
        },
        required: ["countedHours", "margin", "within"],
      },
      ports: {
        inputs: [
          {
            id: "elapsedHours",
            label: "Elapsed Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "excludedHours",
            label: "Excluded Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedTarget",
            label: "Supplied Target",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "countedHours",
            label: "Counted Hours",
            valueType: { type: "number" },
          },
          { id: "margin", label: "Margin", valueType: { type: "number" } },
          { id: "within", label: "Within", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = agencyPerformanceResponseTimeExclusionTool.execute;
export default agencyPerformanceResponseTimeExclusionTool;
