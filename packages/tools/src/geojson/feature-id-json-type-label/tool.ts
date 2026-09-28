import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ idJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "idJson", label: "Id json", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const id = H.json(i.idJson);
  H.check(typeof id === "string" || typeof id === "number");
  return H.finish({ kind: typeof id });
};
export const example = {
  input: { idJson: '"123"' },
  output: { result: { kind: "string" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geojson/feature-id-json-type-label",
  title: "GeoJSON: Feature ID JSON Type Label Tool",
  description:
    "Classify a supplied GeoJSON Feature id as a permitted string or finite number, rejecting null, booleans and structured values.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { kind: { type: "string" } },
        required: ["kind"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
