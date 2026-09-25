import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly start: number;
  readonly arrivals: number;
  readonly departures: number;
  readonly observedEnd: number;
};
export type Output = {
  readonly expectedEndDecimal: string;
  readonly residualDecimal: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "integer", minimum: 0 },
    arrivals: { type: "integer", minimum: 0 },
    departures: { type: "integer", minimum: 0 },
    observedEnd: { type: "integer", minimum: 0 },
  },
  required: ["start", "arrivals", "departures", "observedEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedEndDecimal: { type: "string", maxLength: 8192 },
    residualDecimal: { type: "string", maxLength: 8192 },
  },
  required: ["expectedEndDecimal", "residualDecimal"],
} as const;
/** Calculate migration cohort balance gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { start, arrivals, departures, observedEnd } = request;
  const compute = (): Output => {
    H.integer(start, 0);
    H.integer(arrivals, 0);
    H.integer(departures, 0);
    H.integer(observedEnd, 0);
    H.domain(BigInt(departures) <= BigInt(start) + BigInt(arrivals));
    return {
      expectedEndDecimal: (
        BigInt(start) +
        BigInt(arrivals) -
        BigInt(departures)
      ).toString(),
      residualDecimal: (
        BigInt(observedEnd) -
        BigInt(start) -
        BigInt(arrivals) +
        BigInt(departures)
      ).toString(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { start: 100, arrivals: 20, departures: 10, observedEnd: 108 },
  output: { expectedEndDecimal: "110", residualDecimal: "-2" },
} satisfies ToolExample<Input, Output>;
export const migrationCohortBalanceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/migration-cohort-balance-gap",
    title: "Migration Cohort Balance Gap Tool",
    description:
      "Calculate migration cohort balance gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        start: { type: "integer", minimum: 0 },
        arrivals: { type: "integer", minimum: 0 },
        departures: { type: "integer", minimum: 0 },
        observedEnd: { type: "integer", minimum: 0 },
      },
      required: ["start", "arrivals", "departures", "observedEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedEndDecimal: { type: "string", maxLength: 8192 },
        residualDecimal: { type: "string", maxLength: 8192 },
      },
      required: ["expectedEndDecimal", "residualDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "start",
          label: "Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "arrivals",
          label: "Arrivals",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "departures",
          label: "Departures",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observedEnd",
          label: "Observed End",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "expectedEndDecimal",
          label: "Expected End Decimal",
          valueType: { type: "string" },
        },
        {
          id: "residualDecimal",
          label: "Residual Decimal",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = migrationCohortBalanceGapTool.execute;
export default migrationCohortBalanceGapTool;
