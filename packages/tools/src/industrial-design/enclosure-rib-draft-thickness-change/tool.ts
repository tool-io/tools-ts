import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseThickness: number;
  readonly height: number;
  readonly draftRadians: number;
  readonly bothSides: boolean;
};
export type Output = {
  readonly tipThickness: number;
  readonly thicknessChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseThickness: { type: "number", minimum: 0 },
    height: { type: "number", minimum: 0 },
    draftRadians: { type: "number" },
    bothSides: { type: "boolean" },
  },
  required: ["baseThickness", "height", "draftRadians", "bothSides"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tipThickness: { type: "number" },
    thicknessChange: { type: "number" },
  },
  required: ["tipThickness", "thicknessChange"],
} as const;
/** Signed linear draft geometry, retaining a negative tip result as an explicit geometry conflict. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseThickness, height, draftRadians, bothSides } = request;
  const compute = (): Output => {
    H.domain(
      baseThickness >= 0 && height >= 0 && Math.abs(draftRadians) < Math.PI / 2,
    );
    return {
      tipThickness:
        baseThickness - (bothSides ? 2 : 1) * height * Math.tan(draftRadians),
      thicknessChange: -(bothSides ? 2 : 1) * height * Math.tan(draftRadians),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseThickness: 4, height: 10, draftRadians: 0, bothSides: true },
  output: { tipThickness: 4, thicknessChange: 0 },
} satisfies ToolExample<Input, Output>;
export const enclosureRibDraftThicknessChangeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/enclosure-rib-draft-thickness-change",
    title: "Enclosure Rib Draft Thickness Change Tool",
    description:
      "Signed linear draft geometry, retaining a negative tip result as an explicit geometry conflict.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseThickness: { type: "number", minimum: 0 },
        height: { type: "number", minimum: 0 },
        draftRadians: { type: "number" },
        bothSides: { type: "boolean" },
      },
      required: ["baseThickness", "height", "draftRadians", "bothSides"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tipThickness: { type: "number" },
        thicknessChange: { type: "number" },
      },
      required: ["tipThickness", "thicknessChange"],
    },
    ports: {
      inputs: [
        {
          id: "baseThickness",
          label: "Base Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "height",
          label: "Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "draftRadians",
          label: "Draft Radians",
          required: true,
          valueType: { type: "number", unit: "rad" },
        },
        {
          id: "bothSides",
          label: "Both Sides",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "tipThickness",
          label: "Tip Thickness",
          valueType: { type: "number" },
        },
        {
          id: "thicknessChange",
          label: "Thickness Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = enclosureRibDraftThicknessChangeTool.execute;
export default enclosureRibDraftThicknessChangeTool;
