"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

// Studio structure grouped by business concern — DOC/SANITY_CMS_ARCHITECTURE.md § 3.
export default defineConfig({
  basePath: "/studio",
  name: "distance-mba-college",
  title: "Distance MBA College",
  projectId,
  dataset,
  schema,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
