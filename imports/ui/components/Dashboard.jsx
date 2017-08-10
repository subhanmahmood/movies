import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import $ from 'jquery';
import ReactDOM from 'react-dom';
import { Session } from 'meteor/session'

import Movies from '../../api/movies';

import { Loader } from './Materialize';

class MovieCard extends Component {
  render( ) {
    return (
      <div className="col s12 m6">
        <div className="card">
          <div className="card-content">
            <span className="card-title truncate">
              <div className="chip">
                {this.props.movie.Rank}
              </div>
              &nbsp;{this.props.movie.Title}
            </span>
            <p className="truncate">{this.props.movie.Description}</p>
            {this.props.movie.Genre.split( "," ).map( function( genre, i ) {
              i += 1;
              return <div key={i} className="chip">
                {genre}
              </div>
            })}
          </div>
        </div>
      </div>
    )
  }
}

class Dashboard extends Component {
  constructor( props ) {
    super( props );
    this.handleSubmit = this.handleSubmit.bind( this );
  }
  loadMore( ) {
    let newLimit = Session.get( 'limit' ) + 10;
    Session.set( 'limit', newLimit );
  }
  handleSubmit( ) {
    let chips = $( '.chips-autocomplete' ).material_chip( 'data' );
    if ( chips.length != 3 ) {
      Materialize.toast( "Please enter at least 3 genres.", 2000 );
    } else {
      Session.set( 'genre', chips );
    }
  }
  render( ) {
    return (
      <div>
        <div className="container">
          <h2>Movies</h2>
          <div className="row">
            <div className="col s6">
              <div className="chips chips-autocomplete" ref="chipsautocomplete"></div>
            </div>
            <div className="col s6">
              <a href="" onClick={this.handleSubmit} className="btn blue waves-effect">Submit</a>
            </div>
          </div>
          <div className="row">
            {this.props.loading
              ? this.props.movies.map( function( movie ) {
                return <MovieCard key={movie._id} movie={movie}/>
              })
              : <div className="center">
                <Loader/>
              </div>
}
          </div>
          <div className="row center">
            <a href="" className="btn-large blue waves-effect" onClick={this.loadMore}>Load More</a>
          </div>
        </div>
      </div>
    )
  }
  componentWillMount( ) {
    Session.set( 'limit', 10 );
    Session.set( 'genre', undefined );
  }
  componentWillUnmount( ) {
    Session.set( 'genre', undefined );
  }
  componentDidMount( ) {
    $( document ).ready( function( ) {
      // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
      $( '.tooltipped' ).tooltip({ delay: 50 });
      $( 'select' ).material_select( );
      $( '.chips-autocomplete' ).material_chip({
        autocompleteOptions: {
          data: {
            'Action': null,
            'Animation': null,
            'Adventure': null,
            'Comedy': null,
            'Drama': null,
            'Fantasy': null,
            'Biography': null,
            'Family': null,
            'Thriller': null,
            'Sci-Fi': null,
            'Crime': null,
            'Horror': null
          },
          limit: 3,
          minLength: 1
        }
      });
    });

  }
}

export default createContainer( function( ) {
  const subscription = Meteor.subscribe( 'movies' );
  const loading = subscription.ready( );
  let movies = "";
  let query = {}
  if ( Session.get( 'genre' ) === undefined ) {
    console.log("Undefined: " + Session.get( 'genre' ) + " " + typeof Session.get( 'genre' ));
  } else {
    let genres = Session.get( 'genre' );
    let length = genres.length;
    let genre1 = new RegExp( genres[0]["tag" ]);
    let genre2 = new RegExp( genres[1]["tag" ]);
    let genre3 = new RegExp( genres[2]["tag" ]);
    query = {
      $or: [
        {
          $and: [
            {
              Genre: genre1
            }, {
              Genre: genre2
            }, {
              Genre: genre3
            }
          ]
        }, {
          Genre: genre1
        }, {
          Genre: genre2
        }, {
          Genre: genre3
        }
      ]
    }
    console.log("Defined: " + Session.get( 'genre' ) + " " + typeof Session.get( 'genre' ));
  }

  movies = Movies.find(query, {
    limit: Session.get( 'limit' )
  }).fetch( );

  return { loading, movies }
}, Dashboard)
