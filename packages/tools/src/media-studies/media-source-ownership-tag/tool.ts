import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outletName: string;
  readonly ownerName: string;
  readonly asOfDate: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outletName: { type: "string", maxLength: 8192 },
    ownerName: { type: "string", maxLength: 8192 },
    asOfDate: { type: "string", maxLength: 8192 },
  },
  required: ["outletName", "ownerName", "asOfDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Label supplied media ownership metadata with its as-of date without asserting current ownership. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outletName, ownerName, asOfDate } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    H.domain(outletName.length > 0 && ownerName.length > 0, "outletName");
    namedDate(asOfDate, "asOfDate");
    return {
      tag: outletName + "; recorded owner=" + ownerName + "; as of " + asOfDate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    outletName: "Outlet A",
    ownerName: "Group B",
    asOfDate: "2026-10-01",
  },
  output: { tag: "Outlet A; recorded owner=Group B; as of 2026-10-01" },
} satisfies ToolExample<Input, Output>;
export const mediaSourceOwnershipTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "media-studies/media-source-ownership-tag",
    title: "Media Source Ownership Tag Tool",
    description:
      "Label supplied media ownership metadata with its as-of date without asserting current ownership.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outletName: { type: "string", maxLength: 8192 },
        ownerName: { type: "string", maxLength: 8192 },
        asOfDate: { type: "string", maxLength: 8192 },
      },
      required: ["outletName", "ownerName", "asOfDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "outletName",
          label: "Outlet Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "ownerName",
          label: "Owner Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "asOfDate",
          label: "As Of Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = mediaSourceOwnershipTagTool.execute;
export default mediaSourceOwnershipTagTool;
