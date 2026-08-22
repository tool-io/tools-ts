export {
  createDictionaryAutocompleteIndex,
  dictionaryAutocompleteFormat,
  dictionaryAutocompleteFormatVersion,
  parseDictionaryAutocompleteIndex,
  suggestDictionaryTerms,
  type CreateDictionaryAutocompleteIndexInput,
  type DictionaryAutocompleteCapability,
  type DictionaryAutocompleteIndex,
  type DictionaryAutocompleteTerm,
} from "./autocomplete.js";
export { parseDictionaryChunk } from "./chunk.js";
export { lookupDictionary, normalizeDictionaryHeadword } from "./lookup.js";
export {
  dictionaryChunkFormat,
  dictionaryChunkFormatVersion,
  type DictionaryAttribution,
  type DictionaryChunk,
  type DictionaryEntry,
  type DictionaryLookupInput,
  type DictionaryLookupOutput,
  type DictionaryTranslation,
} from "./types.js";
