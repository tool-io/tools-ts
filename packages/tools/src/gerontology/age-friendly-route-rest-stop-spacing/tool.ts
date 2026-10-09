import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStopDistance: number;
  readonly nextStopDistance: number;
};
export type Output = { readonly spacing: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStopDistance: { type: "number", minimum: 0 },
    nextStopDistance: { type: "number" },
  },
  required: ["firstStopDistance", "nextStopDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { spacing: { type: "number" } },
  required: ["spacing"],
} as const;
/** Calculate explicit consecutive rest-stop distance spacing on a shared route origin without prescribing walking capacity or accessibility standards. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStopDistance, nextStopDistance } = request;
  const compute = (): Output => {
    H.domain(firstStopDistance >= 0, "firstStopDistance");
    H.domain(nextStopDistance >= firstStopDistance, "nextStopDistance");
    return { spacing: nextStopDistance - firstStopDistance };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstStopDistance: 100, nextStopDistance: 250 },
  output: { spacing: 150 },
} satisfies ToolExample<Input, Output>;
export const ageFriendlyRouteRestStopSpacingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gerontology/age-friendly-route-rest-stop-spacing",
    title: "Age Friendly Route Rest Stop Spacing Tool",
    description:
      "Calculate explicit consecutive rest-stop distance spacing on a shared route origin without prescribing walking capacity or accessibility standards.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstStopDistance: { type: "number", minimum: 0 },
        nextStopDistance: { type: "number" },
      },
      required: ["firstStopDistance", "nextStopDistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { spacing: { type: "number" } },
      required: ["spacing"],
    },
    ports: {
      inputs: [
        {
          id: "firstStopDistance",
          label: "First Stop Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextStopDistance",
          label: "Next Stop Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "spacing", label: "Spacing", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = ageFriendlyRouteRestStopSpacingTool.execute;
export default ageFriendlyRouteRestStopSpacingTool;
