import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialTips: number;
  readonly bifurcations: number;
  readonly terminatedTips: number;
};
export type Output = { readonly tips: number; readonly netAdded: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialTips: { type: "integer", minimum: 0 },
    bifurcations: { type: "integer", minimum: 0 },
    terminatedTips: { type: "integer", minimum: 0 },
  },
  required: ["initialTips", "bifurcations", "terminatedTips"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tips: { type: "integer" }, netAdded: { type: "integer" } },
  required: ["tips", "netAdded"],
} as const;
/** Each isolated binary tip bifurcation replaces one tip by two, adding one terminal tip. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialTips, bifurcations, terminatedTips } = request;
  const compute = (): Output => {
    H.integer(initialTips, 0);
    H.integer(bifurcations, 0);
    H.integer(terminatedTips, 0, initialTips + bifurcations);
    return {
      tips: initialTips + bifurcations - terminatedTips,
      netAdded: bifurcations - terminatedTips,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialTips: 2, bifurcations: 5, terminatedTips: 1 },
  output: { tips: 6, netAdded: 4 },
} satisfies ToolExample<Input, Output>;
export const branchingOrganTipBifurcationCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/branching-organ-tip-bifurcation-count",
    title: "Branching Organ Tip Bifurcation Count Tool",
    description:
      "Each isolated binary tip bifurcation replaces one tip by two, adding one terminal tip.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialTips: { type: "integer", minimum: 0 },
        bifurcations: { type: "integer", minimum: 0 },
        terminatedTips: { type: "integer", minimum: 0 },
      },
      required: ["initialTips", "bifurcations", "terminatedTips"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tips: { type: "integer" }, netAdded: { type: "integer" } },
      required: ["tips", "netAdded"],
    },
    ports: {
      inputs: [
        {
          id: "initialTips",
          label: "Initial Tips",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "bifurcations",
          label: "Bifurcations",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "terminatedTips",
          label: "Terminated Tips",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "tips", label: "Tips", valueType: { type: "integer" } },
        { id: "netAdded", label: "Net Added", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = branchingOrganTipBifurcationCountTool.execute;
export default branchingOrganTipBifurcationCountTool;
