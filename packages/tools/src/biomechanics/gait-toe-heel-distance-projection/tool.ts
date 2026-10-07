import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly heelPosition: readonly number[];
  readonly toePosition: readonly number[];
  readonly forwardUnitAxis: readonly number[];
};
export type Output = { readonly forwardDistance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heelPosition: { type: "array", maxItems: 256, items: { type: "number" } },
    toePosition: { type: "array", maxItems: 256, items: { type: "number" } },
    forwardUnitAxis: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["heelPosition", "toePosition", "forwardUnitAxis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { forwardDistance: { type: "number" } },
  required: ["forwardDistance"],
} as const;
/** Project the supplied heel-to-toe vector onto an explicitly supplied unit forward axis without inferring gait direction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { heelPosition, toePosition, forwardUnitAxis } = request;
  const compute = (): Output => {
    H.domain(heelPosition.length > 0, "heelPosition");
    H.domain(heelPosition.length === toePosition.length, "toePosition");
    H.domain(heelPosition.length === forwardUnitAxis.length, "forwardUnitAxis");
    H.domain(
      Math.abs(Math.hypot(...forwardUnitAxis) - 1) <= 1e-12,
      "forwardUnitAxis",
    );
    return {
      forwardDistance: toePosition.reduce(
        (sum, value, index) =>
          sum + (value - heelPosition[index]) * forwardUnitAxis[index],
        0,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { heelPosition: [0, 0], toePosition: [3, 4], forwardUnitAxis: [1, 0] },
  output: { forwardDistance: 3 },
} satisfies ToolExample<Input, Output>;
export const gaitToeHeelDistanceProjectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biomechanics", "engineering"],
      keywords: ["biomechanics", "engineering"],
    },
    id: "biomechanics/gait-toe-heel-distance-projection",
    title: "Gait Toe Heel Distance Projection",
    description:
      "Project the supplied heel-to-toe vector onto an explicitly supplied unit forward axis without inferring gait direction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        heelPosition: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        toePosition: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        forwardUnitAxis: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["heelPosition", "toePosition", "forwardUnitAxis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { forwardDistance: { type: "number" } },
      required: ["forwardDistance"],
    },
    ports: {
      inputs: [
        {
          id: "heelPosition",
          label: "Heel Position",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "toePosition",
          label: "Toe Position",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "forwardUnitAxis",
          label: "Forward Unit Axis",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "forwardDistance",
          label: "Forward Distance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gaitToeHeelDistanceProjectionTool.execute;
export default gaitToeHeelDistanceProjectionTool;
