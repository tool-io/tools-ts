import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingWidth: number;
  readonly propWidth: number;
  readonly sideAllowance: number;
};
export type Output = { readonly margin: number; readonly fits: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingWidth: { type: "number", minimum: 0 },
    propWidth: { type: "number", minimum: 0 },
    sideAllowance: { type: "number", minimum: 0 },
  },
  required: ["openingWidth", "propWidth", "sideAllowance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { margin: { type: "number" }, fits: { type: "boolean" } },
  required: ["margin", "fits"],
} as const;
/** Calculate stage wing prop clearance gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingWidth, propWidth, sideAllowance } = request;
  const compute = (): Output => {
    H.domain(openingWidth >= 0 && propWidth >= 0 && sideAllowance >= 0);
    return {
      margin: openingWidth - propWidth - 2 * sideAllowance,
      fits: openingWidth >= propWidth + 2 * sideAllowance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingWidth: 3, propWidth: 2, sideAllowance: 0.25 },
  output: { margin: 0.5, fits: true },
} satisfies ToolExample<Input, Output>;
export const stageWingPropClearanceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/stage-wing-prop-clearance-gap",
    title: "Stage Wing Prop Clearance Gap Tool",
    description:
      "Calculate stage wing prop clearance gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingWidth: { type: "number", minimum: 0 },
        propWidth: { type: "number", minimum: 0 },
        sideAllowance: { type: "number", minimum: 0 },
      },
      required: ["openingWidth", "propWidth", "sideAllowance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { margin: { type: "number" }, fits: { type: "boolean" } },
      required: ["margin", "fits"],
    },
    ports: {
      inputs: [
        {
          id: "openingWidth",
          label: "Opening Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "propWidth",
          label: "Prop Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sideAllowance",
          label: "Side Allowance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = stageWingPropClearanceGapTool.execute;
export default stageWingPropClearanceGapTool;
