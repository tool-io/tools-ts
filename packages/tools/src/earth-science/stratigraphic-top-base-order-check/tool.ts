import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly topDepth: number;
  readonly baseDepth: number;
  readonly depthIncreasesDownward: boolean;
};
export type Output = {
  readonly ordered: boolean;
  readonly signedThickness: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    topDepth: { type: "number" },
    baseDepth: { type: "number" },
    depthIncreasesDownward: { type: "boolean" },
  },
  required: ["topDepth", "baseDepth", "depthIncreasesDownward"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ordered: { type: "boolean" },
    signedThickness: { type: "number" },
  },
  required: ["ordered", "signedThickness"],
} as const;
/** Compare supplied stratigraphic top and base under an explicit depth-axis convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { topDepth, baseDepth, depthIncreasesDownward } = request;
  const compute = (): Output => {
    return {
      ordered: depthIncreasesDownward
        ? baseDepth >= topDepth
        : topDepth >= baseDepth,
      signedThickness:
        (baseDepth - topDepth) * (depthIncreasesDownward ? 1 : -1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { topDepth: 10, baseDepth: 20, depthIncreasesDownward: true },
  output: { ordered: true, signedThickness: 10 },
} satisfies ToolExample<Input, Output>;
export const stratigraphicTopBaseOrderCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "earth-science",
        "earth science",
        "earth and environmental sciences",
      ],
      keywords: ["earth science", "earth and environmental sciences"],
    },
    id: "earth-science/stratigraphic-top-base-order-check",
    title: "Stratigraphic Top Base Order Check",
    description:
      "Compare supplied stratigraphic top and base under an explicit depth-axis convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        topDepth: { type: "number" },
        baseDepth: { type: "number" },
        depthIncreasesDownward: { type: "boolean" },
      },
      required: ["topDepth", "baseDepth", "depthIncreasesDownward"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ordered: { type: "boolean" },
        signedThickness: { type: "number" },
      },
      required: ["ordered", "signedThickness"],
    },
    ports: {
      inputs: [
        {
          id: "topDepth",
          label: "Top Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baseDepth",
          label: "Base Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "depthIncreasesDownward",
          label: "Depth Increases Downward",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "ordered", label: "Ordered", valueType: { type: "boolean" } },
        {
          id: "signedThickness",
          label: "Signed Thickness",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = stratigraphicTopBaseOrderCheckTool.execute;
export default stratigraphicTopBaseOrderCheckTool;
