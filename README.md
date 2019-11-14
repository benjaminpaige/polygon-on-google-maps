NOTE: This is not the best option for drawing polygons on a map. A better alternative would be using Mapbox and (if needed) deck.gl. But if you are constrained to use google maps due to cost at scale, you might find this helpful.

### Yard mapping component

Just some boilerplate of a yard mapping react component using google maps with the [react-google-maps](https://github.com/tomchentw/react-google-maps) api plus a lottie and material ui for a little style.

This component uses Drawing manager to create and add controlled polygons to a map and calc their area (sq meters). 

You can also edit and clear the controlled polygons

## To run 
run `npm install` and `npm run dev`
