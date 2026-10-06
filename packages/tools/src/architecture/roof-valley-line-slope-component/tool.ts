import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly risePerHorizontalRun: number;
  readonly horizontalRun: number;
};
export type Output = { readonly rise: number; readonly slopedLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    risePerHorizontalRun: { type: "number" },
    horizontalRun: { type: "number", minimum: 0 },
  },
  required: ["risePerHorizontalRun", "horizontalRun"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rise: { type: "number" }, slopedLength: { type: "number" } },
  required: ["rise", "slopedLength"],
} as const;
/** Resolve an explicit roof-valley line slope and horizontal run into signed rise and sloped length without deriving intersecting roof geometry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { risePerHorizontalRun, horizontalRun } = request;
  const compute = (): Output => {
    H.domain(horizontalRun >= 0, "horizontalRun");
    return {
      rise: risePerHorizontalRun * horizontalRun,
      slopedLength: Math.hypot(
        horizontalRun,
        risePerHorizontalRun * horizontalRun,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { risePerHorizontalRun: 0.75, horizontalRun: 4 },
  output: { rise: 3, slopedLength: 5 },
} satisfies ToolExample<Input, Output>;
export const roofValleyLineSlopeComponentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["architecture", "arts and design"],
      keywords: ["architecture", "arts and design"],
    },
    id: "architecture/roof-valley-line-slope-component",
    title: "Roof Valley Line Slope Component",
    description:
      "Resolve an explicit roof-valley line slope and horizontal run into signed rise and sloped length without deriving intersecting roof geometry.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        risePerHorizontalRun: { type: "number" },
        horizontalRun: { type: "number", minimum: 0 },
      },
      required: ["risePerHorizontalRun", "horizontalRun"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rise: { type: "number" },
        slopedLength: { type: "number" },
      },
      required: ["rise", "slopedLength"],
    },
    ports: {
      inputs: [
        {
          id: "risePerHorizontalRun",
          label: "Rise Per Horizontal Run",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "horizontalRun",
          label: "Horizontal Run",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "rise", label: "Rise", valueType: { type: "number" } },
        {
          id: "slopedLength",
          label: "Sloped Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = roofValleyLineSlopeComponentTool.execute;
export default roofValleyLineSlopeComponentTool;
