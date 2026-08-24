import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type SchemaCrosswalkFieldFinderInput = {
  readonly dublinCoreField:
    | "title"
    | "creator"
    | "date"
    | "identifier"
    | "subject"
    | "coverage"
    | "type"
    | "language"
    | "description"
    | "publisher"
    | "rights"
    | "relation"
    | "format";
};

export type SchemaCrosswalkFieldFinderOutput = {
  readonly eadElement: string;
  readonly dcTermUri: string;
};

const DC_TO_EAD: Record<
  SchemaCrosswalkFieldFinderInput["dublinCoreField"],
  string
> = {
  title: "unittitle",
  creator: "origination",
  date: "unitdate",
  identifier: "unitid",
  subject: "controlaccess/subject",
  coverage: "controlaccess/geogname",
  type: "controlaccess/genreform",
  language: "langmaterial",
  description: "abstract",
  publisher: "publicationstmt",
  rights: "accessrestrict",
  relation: "relatedmaterial",
  format: "physdesc",
};

export const calculateSchemaCrosswalkFieldFinder = (
  input: SchemaCrosswalkFieldFinderInput,
): SchemaCrosswalkFieldFinderOutput => ({
  eadElement: DC_TO_EAD[input.dublinCoreField],
  dcTermUri: `http://purl.org/dc/elements/1.1/${input.dublinCoreField}`,
});

export const schemaCrosswalkFieldFinderExample = {
  input: { dublinCoreField: "subject" },
  output: {
    eadElement: "controlaccess/subject",
    dcTermUri: "http://purl.org/dc/elements/1.1/subject",
  },
} satisfies ToolExample<
  SchemaCrosswalkFieldFinderInput,
  SchemaCrosswalkFieldFinderOutput
>;

export const schemaCrosswalkFieldFinderTool = createSimpleTool({
  id: "archival-studies/schema-crosswalk-field-finder",
  title: "Metadata Schema Crosswalk Field Match Finder (Dublin Core-EAD)",
  description:
    "Map a Dublin Core element to its customary EAD counterpart; institutional crosswalks vary, so correspondences follow common SAA-style practice.",
  inputs: [
    {
      description: "Dublin Core element to crosswalk.",
      enum: [
        "title",
        "creator",
        "date",
        "identifier",
        "subject",
        "coverage",
        "type",
        "language",
        "description",
        "publisher",
        "rights",
        "relation",
        "format",
      ],
      id: "dublinCoreField",
      kind: "string",
      label: "DC field",
    },
  ],
  outputs: [
    {
      description: "Customary EAD element or element path.",
      id: "eadElement",
      kind: "string",
      label: "EAD element",
    },
    {
      description: "Canonical Dublin Core term URI for the field.",
      id: "dcTermUri",
      kind: "string",
      label: "DC term URI",
    },
  ],
  calculate: (input) =>
    calculateSchemaCrosswalkFieldFinder({
      dublinCoreField:
        input.dublinCoreField as SchemaCrosswalkFieldFinderInput["dublinCoreField"],
    }),
});

export const runSchemaCrosswalkFieldFinder =
  schemaCrosswalkFieldFinderTool.execute;
export default schemaCrosswalkFieldFinderTool;
