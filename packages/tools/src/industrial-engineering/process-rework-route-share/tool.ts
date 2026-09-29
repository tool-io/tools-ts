import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly routeIds: readonly string[];
  readonly quantities: readonly number[];
  readonly reworkRoutes: readonly string[];
};
export type Output = {
  readonly totalQuantity: number;
  readonly reworkQuantity: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    routeIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    quantities: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    reworkRoutes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["routeIds", "quantities", "reworkRoutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalQuantity: { type: "number" },
    reworkQuantity: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["totalQuantity", "reworkQuantity", "share", "defined"],
} as const;
/** Calculate process rework route share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { routeIds, quantities, reworkRoutes } = request;
  const compute = (): Output => {
    H.sameLength(routeIds, quantities);
    H.domain(quantities.every((x) => x >= 0));
    return (() => {
      const totalQuantity = quantities.reduce((a, b) => a + b, 0),
        reworkQuantity = quantities.reduce(
          (s, x, i) => s + (reworkRoutes.includes(routeIds[i]) ? x : 0),
          0,
        );
      return {
        totalQuantity,
        reworkQuantity,
        share: totalQuantity > 0 ? reworkQuantity / totalQuantity : 0,
        defined: totalQuantity > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    routeIds: ["A", "R", "B"],
    quantities: [10, 5, 5],
    reworkRoutes: ["R"],
  },
  output: { totalQuantity: 20, reworkQuantity: 5, share: 0.25, defined: true },
} satisfies ToolExample<Input, Output>;
export const processReworkRouteShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/process-rework-route-share",
    title: "Process Rework Route Share Tool",
    description:
      "Calculate process rework route share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        routeIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        quantities: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        reworkRoutes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["routeIds", "quantities", "reworkRoutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalQuantity: { type: "number" },
        reworkQuantity: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["totalQuantity", "reworkQuantity", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "routeIds",
          label: "Route Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "quantities",
          label: "Quantities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "reworkRoutes",
          label: "Rework Routes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "totalQuantity",
          label: "Total Quantity",
          valueType: { type: "number" },
        },
        {
          id: "reworkQuantity",
          label: "Rework Quantity",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = processReworkRouteShareTool.execute;
export default processReworkRouteShareTool;
