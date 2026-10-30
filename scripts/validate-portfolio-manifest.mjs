#!/usr/bin/env node

import { readFile } from 'node:fs/promises'
import Ajv2020 from 'ajv/dist/2020.js'
import { validateManifest } from './check-portfolio-links.mjs'

const manifestPath = process.argv[2] || 'public/portfolio-manifest.json'
const schemaPath = process.argv[3] || 'public/portfolio-manifest.schema.json'

const [manifest, schema] = await Promise.all([
  readFile(manifestPath, 'utf8').then(JSON.parse),
  readFile(schemaPath, 'utf8').then(JSON.parse)
])

const ajv = new Ajv2020({ allErrors: true, strict: true, validateFormats: false })
const validate = ajv.compile(schema)
if (!validate(manifest)) {
  console.error('Portfolio Manifest failed JSON Schema validation:')
  for (const error of validate.errors || []) {
    console.error(`- ${error.instancePath || '/'} ${error.message}`)
  }
  process.exitCode = 1
} else {
  validateManifest(manifest)
  console.log(`Portfolio Manifest is valid: schema v${manifest.schemaVersion}, ${manifest.artifacts.length} artifacts, ${manifest.projects.length} projects`)
}
