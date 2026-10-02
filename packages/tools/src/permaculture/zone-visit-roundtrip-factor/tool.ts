import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oneWayDistance: number;
  readonly visits: number;
  readonly suppliedReturnFactor: number;
  readonly sharedTravel: number;
};
export type Output = {
  readonly grossTravel: number;
  readonly netTravel: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oneWayDistance: { type: "number", minimum: 0 },
    visits: { type: "integer", minimum: 0 },
    suppliedReturnFactor: { type: "number", minimum: 0 },
    sharedTravel: { type: "number", minimum: 0 },
  },
  required: [
    "oneWayDistance",
    "visits",
    "suppliedReturnFactor",
    "sharedTravel",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossTravel: { type: "number" },
    netTravel: { type: "number" },
  },
  required: ["grossTravel", "netTravel"],
} as const;
/** Calculate zone visit roundtrip factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oneWayDistance, visits, suppliedReturnFactor, sharedTravel } =
    request;
  const compute = (): Output => {
    H.integer(visits, 0);
    H.domain(
      oneWayDistance >= 0 &&
        suppliedReturnFactor >= 0 &&
        sharedTravel >= 0 &&
        sharedTravel <= oneWayDistance * visits * suppliedReturnFactor,
    );
    return {
      grossTravel: oneWayDistance * visits * suppliedReturnFactor,
      netTravel: oneWayDistance * visits * suppliedReturnFactor - sharedTravel,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    oneWayDistance: 2,
    visits: 10,
    suppliedReturnFactor: 2,
    sharedTravel: 5,
  },
  output: { grossTravel: 40, netTravel: 35 },
} satisfies ToolExample<Input, Output>;
export const zoneVisitRoundtripFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "permaculture/zone-visit-roundtrip-factor",
    title: "Zone Visit Roundtrip Factor Tool",
    description:
      "Calculate zone visit roundtrip factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oneWayDistance: { type: "number", minimum: 0 },
        visits: { type: "integer", minimum: 0 },
        suppliedReturnFactor: { type: "number", minimum: 0 },
        sharedTravel: { type: "number", minimum: 0 },
      },
      required: [
        "oneWayDistance",
        "visits",
        "suppliedReturnFactor",
        "sharedTravel",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossTravel: { type: "number" },
        netTravel: { type: "number" },
      },
      required: ["grossTravel", "netTravel"],
    },
    ports: {
      inputs: [
        {
          id: "oneWayDistance",
          label: "One Way Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "visits",
          label: "Visits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedReturnFactor",
          label: "Supplied Return Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedTravel",
          label: "Shared Travel",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossTravel",
          label: "Gross Travel",
          valueType: { type: "number" },
        },
        { id: "netTravel", label: "Net Travel", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = zoneVisitRoundtripFactorTool.execute;
export default zoneVisitRoundtripFactorTool;
