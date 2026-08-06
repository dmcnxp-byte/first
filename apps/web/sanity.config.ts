"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";

// Studio structure customization (DOC/SANITY_CMS_ARCHITECTURE.md § 3) and
// content-governance validation rules (§ 8) are Phase 3 work, once the
// document types they organize/validate actually exist.
export default defineConfig({
  basePath: "/studio",
  name: "distance-mba-college",
  title: "Distance MBA College",
  projectId,
  dataset,
  schema,
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
});
