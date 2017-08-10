import { Meteor } from 'meteor/meteor';
import Movies from '../imports/api/movies.js';

Meteor.publish( 'movies', function(  ) {
  return Movies.find({}, {
    sort: {
      Rank: 1
    }
  })
})
