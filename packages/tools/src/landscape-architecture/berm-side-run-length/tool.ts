import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bermRise: number;
  readonly suppliedHorizontalPerVertical: number;
};
export type Output = {
  readonly horizontalRun: number;
  readonly slopedLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bermRise: { type: "number", minimum: 0 },
    suppliedHorizontalPerVertical: { type: "number", minimum: 0 },
  },
  required: ["bermRise", "suppliedHorizontalPerVertical"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    horizontalRun: { type: "number" },
    slopedLength: { type: "number" },
  },
  required: ["horizontalRun", "slopedLength"],
} as const;
/** Resolve explicit berm rise and supplied horizontal-per-vertical side ratio into run and side length without assessing slope stability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bermRise, suppliedHorizontalPerVertical } = request;
  const compute = (): Output => {
    H.domain(bermRise >= 0 && suppliedHorizontalPerVertical >= 0, "bermRise");
    return {
      horizontalRun: bermRise * suppliedHorizontalPerVertical,
      slopedLength: Math.hypot(
        bermRise,
        bermRise * suppliedHorizontalPerVertical,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bermRise: 3, suppliedHorizontalPerVertical: 4 },
  output: { horizontalRun: 12, slopedLength: 12.36931687685298 },
} satisfies ToolExample<Input, Output>;
export const bermSideRunLengthTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "landscape-architecture",
        "landscape architecture",
        "arts and design",
      ],
      keywords: ["landscape architecture", "arts and design"],
    },
    id: "landscape-architecture/berm-side-run-length",
    title: "Berm Side Run Length",
    description:
      "Resolve explicit berm rise and supplied horizontal-per-vertical side ratio into run and side length without assessing slope stability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bermRise: { type: "number", minimum: 0 },
        suppliedHorizontalPerVertical: { type: "number", minimum: 0 },
      },
      required: ["bermRise", "suppliedHorizontalPerVertical"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        horizontalRun: { type: "number" },
        slopedLength: { type: "number" },
      },
      required: ["horizontalRun", "slopedLength"],
    },
    ports: {
      inputs: [
        {
          id: "bermRise",
          label: "Berm Rise",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedHorizontalPerVertical",
          label: "Supplied Horizontal Per Vertical",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "horizontalRun",
          label: "Horizontal Run",
          valueType: { type: "number" },
        },
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
export const run = bermSideRunLengthTool.execute;
export default bermSideRunLengthTool;
