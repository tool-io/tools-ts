# Versioning and compatibility

The package follows
[Semantic Versioning 2.0.0](https://semver.org/), including
explicit prerelease identifiers. Tool IDs, exported functions
and types, input/output schemas, units, defaults, error codes,
and documented execution behavior are part of its public API.
ESM is the supported module format; CommonJS interoperability is
not guaranteed.

Before 1.0, patch releases contain backward-compatible fixes.
New public functionality or incompatible changes increment the
minor version; breaking changes must be identified in release
notes with migration guidance. Pin an exact version or Git
revision and review changes before updating. From 1.0,
incompatible changes increment major, compatible additions
increment minor, and compatible fixes increment patch.
Deprecations identify a replacement before removal. A correction
that breaks documented behavior is still a breaking change, even
when the earlier behavior was incorrect.

Prerelease versions include a stage and iteration, such as
`0.1.0-alpha.1`, `0.1.0-beta.1`, or `0.1.0-rc.1`. The current
alpha prerelease API is experimental and may change
incompatibly. `0.1.0` has no prerelease suffix but remains a
pre-1.0 API; it does not carry the compatibility commitment of a
1.0 release.

While a base version is still in prerelease, changes increment
its prerelease iteration and must be documented, including
incompatible changes. Once that base version is released without
a suffix, the normal increment rules above apply. A prerelease
of the next version does not change existing releases.

Git tags use `v` followed by the package version. Published
versions and tags are immutable; fixes receive a new version.
Prereleases use matching npm `alpha`, `beta` or `rc`
distribution tags, never `latest`. A suffix alone does not
select an npm distribution tag. Build metadata does not replace
a new version for a changed published artifact.

Package versions, per-tool contract versions, contract
fingerprints, and catalog fingerprints are separate identities;
changing one does not automatically increment the others.
Changes to tools must still receive the package bump required by
their public compatibility impact.
