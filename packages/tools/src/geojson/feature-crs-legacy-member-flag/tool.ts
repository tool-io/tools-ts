import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ featureJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "featureJson", label: "Feature json", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const feature = H.rec(H.json(i.featureJson));
  H.check(feature.type === "Feature");
  return H.finish({
    legacyCrsPresent: Object.hasOwn(feature, "crs"),
    rfc7946CrsMemberAllowed: false,
  });
};
export const example = {
  input: {
    featureJson:
      '{"type":"Feature","geometry":null,"properties":{},"crs":null}',
  },
  output: {
    result: { legacyCrsPresent: true, rfc7946CrsMemberAllowed: false },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geojson/feature-crs-legacy-member-flag",
  title: "GeoJSON: Feature Crs Legacy Member Flag Tool",
  description:
    "Flag the presence of a legacy crs member on one declared GeoJSON Feature, including null; does not transform coordinates or validate a complete feature schema.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          legacyCrsPresent: { type: "boolean" },
          rfc7946CrsMemberAllowed: { type: "boolean" },
        },
        required: ["legacyCrsPresent", "rfc7946CrsMemberAllowed"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
