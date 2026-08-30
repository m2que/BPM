# Local Notes

## Remaining uncommitted local edits

### `App.tsx`
- Reformats the `DashboardDisplay` JSX props across multiple lines.
- No behavior change; formatting only.

### `components/PerceptualMap.tsx`
- Changes competitor color palette by replacing `#f59e0b` with `#334155` in `competitorFills`.
- Adds `formatMapValue()` to round tooltip X/Y values.
- Uses rounded values in the tooltip display.
- Extracts chart margins into a `chartBounds` object and passes that into `ScatterChart`.
- Functional impact appears limited to rounded tooltip values and updated competitor colors.

## Note about the pushed commit

The pushed commit `7a472c6` included additional `components/DashboardDisplay.tsx` changes beyond the stripe-color update:

- Adds `renderFormattedText()` to render `**bold**` segments and preserve line breaks.
- Uses that formatter for the two text blocks.
- Removes an inline style from the "Run New Analysis" button.
