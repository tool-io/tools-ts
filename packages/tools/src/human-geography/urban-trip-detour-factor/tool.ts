import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly routeDistances: readonly number[];
  readonly directDistances: readonly number[];
};
export type Output = {
  readonly routeTotal: number;
  readonly directTotal: number;
  readonly aggregateDetour: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    routeDistances: { type: "array", maxItems: 256, items: { type: "number" } },
    directDistances: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["routeDistances", "directDistances"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    routeTotal: { type: "number" },
    directTotal: { type: "number" },
    aggregateDetour: { type: "number" },
  },
  required: ["routeTotal", "directTotal", "aggregateDetour"],
} as const;
/** Calculate urban trip detour factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { routeDistances, directDistances } = request;
  const compute = (): Output => {
    H.sameLength(routeDistances, directDistances);
    H.domain(
      routeDistances.every(
        (x, i) => directDistances[i] >= 0 && x >= directDistances[i],
      ),
    );
    return (() => {
      const routeTotal = routeDistances.reduce((a, b) => a + b, 0),
        directTotal = directDistances.reduce((a, b) => a + b, 0);
      H.positive(directTotal);
      return {
        routeTotal,
        directTotal,
        aggregateDetour: routeTotal / directTotal,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { routeDistances: [5, 10], directDistances: [4, 6] },
  output: { routeTotal: 15, directTotal: 10, aggregateDetour: 1.5 },
} satisfies ToolExample<Input, Output>;
export const urbanTripDetourFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/urban-trip-detour-factor",
    title: "Urban Trip Detour Factor Tool",
    description:
      "Calculate urban trip detour factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        routeDistances: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        directDistances: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["routeDistances", "directDistances"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        routeTotal: { type: "number" },
        directTotal: { type: "number" },
        aggregateDetour: { type: "number" },
      },
      required: ["routeTotal", "directTotal", "aggregateDetour"],
    },
    ports: {
      inputs: [
        {
          id: "routeDistances",
          label: "Route Distances",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "directDistances",
          label: "Direct Distances",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "routeTotal",
          label: "Route Total",
          valueType: { type: "number" },
        },
        {
          id: "directTotal",
          label: "Direct Total",
          valueType: { type: "number" },
        },
        {
          id: "aggregateDetour",
          label: "Aggregate Detour",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = urbanTripDetourFactorTool.execute;
export default urbanTripDetourFactorTool;
