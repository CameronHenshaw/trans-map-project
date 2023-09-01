# Trans Mapping Project

## Goal

Create a map app that allows users to gain a overarching understanding of information, as well as letting them dig deeper into information for specific states. Accessibility and useability should be prioritized.

## Approach

We choose to use a react app and the highcharts mapping library. This library has a wealth of cumstomizeable accessibility features, which allows us to tailor the map to our needs. The data is obtained through an api call to a google sheet, which ensures the app can be easily changed and updated by someone without any programming knowledge.

## Accessibility features

### Keyboard Navigation and Screen Reader Accessibility

We made sure to configure out app so that it works with keyboard navigation and a screen reader, including adjusting alt text so that the user experience is smooth and not needlessly repetitious.

### Visual Accessibility

With many visualizations, it is best not to encode information solely in color, so that people with colorblindness can still understand the visualization. This is often done by adding a pattern to a visualization, so that information is represented by both a pattern and a color. We tried this and found it added a lot of visual noise to the map, making it overall more difficult to understand. Instead, we configured the map so that hovering highlights states of the same color.
