import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetSolidsMass: number;
  readonly suppliedDryMatterFraction: number;
};
export type Output = { readonly drySolidsMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetSolidsMass: { type: "number", minimum: 0 },
    suppliedDryMatterFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["wetSolidsMass", "suppliedDryMatterFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { drySolidsMass: { type: "number" } },
  required: ["drySolidsMass"],
} as const;
/** Apply an explicit dry-matter fraction to collected wet-solids mass without assessing treatment performance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetSolidsMass, suppliedDryMatterFraction } = request;
  const compute = (): Output => {
    H.domain(wetSolidsMass >= 0, "wetSolidsMass");
    (H.domain(
      suppliedDryMatterFraction >= 0 && suppliedDryMatterFraction <= 1,
      "suppliedDryMatterFraction",
    ),
      suppliedDryMatterFraction);
    return { drySolidsMass: wetSolidsMass * suppliedDryMatterFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetSolidsMass: 20, suppliedDryMatterFraction: 0.25 },
  output: { drySolidsMass: 5 },
} satisfies ToolExample<Input, Output>;
export const aquaponicFilterSolidsDryMatterTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["aquaponics", "agriculture"],
      keywords: ["aquaponics", "agriculture"],
    },
    id: "aquaponics/aquaponic-filter-solids-dry-matter",
    title: "Aquaponic Filter Solids Dry Matter",
    description:
      "Apply an explicit dry-matter fraction to collected wet-solids mass without assessing treatment performance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetSolidsMass: { type: "number", minimum: 0 },
        suppliedDryMatterFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["wetSolidsMass", "suppliedDryMatterFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { drySolidsMass: { type: "number" } },
      required: ["drySolidsMass"],
    },
    ports: {
      inputs: [
        {
          id: "wetSolidsMass",
          label: "Wet Solids Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDryMatterFraction",
          label: "Supplied Dry Matter Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "drySolidsMass",
          label: "Dry Solids Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = aquaponicFilterSolidsDryMatterTool.execute;
export default aquaponicFilterSolidsDryMatterTool;
