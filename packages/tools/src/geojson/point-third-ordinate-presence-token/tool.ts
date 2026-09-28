import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly position: readonly number[] };
export type Output = {
  readonly hasThird: boolean;
  readonly third: number;
  readonly extraOrdinates: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    position: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["position"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hasThird: { type: "boolean" },
    third: { type: "number" },
    extraOrdinates: { type: "integer" },
  },
  required: ["hasThird", "third", "extraOrdinates"],
} as const;
/** Inspect presence of a third ordinate; zero is a flagged placeholder when absent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { position } = request;
  const compute = (): Output => {
    H.domain(position.length >= 2);
    return {
      hasThird: position.length >= 3,
      third: position.length >= 3 ? position[2] : 0,
      extraOrdinates: Math.max(0, position.length - 3),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { position: [10, 20, 30] },
  output: { hasThird: true, third: 30, extraOrdinates: 0 },
} satisfies ToolExample<Input, Output>;
export const pointThirdOrdinatePresenceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/point-third-ordinate-presence-token",
    title: "Point Third Ordinate Presence Token Tool",
    description:
      "Inspect presence of a third ordinate; zero is a flagged placeholder when absent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        position: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["position"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hasThird: { type: "boolean" },
        third: { type: "number" },
        extraOrdinates: { type: "integer" },
      },
      required: ["hasThird", "third", "extraOrdinates"],
    },
    ports: {
      inputs: [
        {
          id: "position",
          label: "Position",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "hasThird", label: "Has Third", valueType: { type: "boolean" } },
        { id: "third", label: "Third", valueType: { type: "number" } },
        {
          id: "extraOrdinates",
          label: "Extra Ordinates",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = pointThirdOrdinatePresenceTokenTool.execute;
export default pointThirdOrdinatePresenceTokenTool;
